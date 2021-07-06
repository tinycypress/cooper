import VotingHelper from "../../activity/redemption/votingHelper";

import COOP, { STATE } from "../../../origin/coop";
import { RAW_EMOJIS, ROLES, CHANNELS } from '../../../origin/config';


export const STARTING_ROLES = [
    'MEMBER', 'BEGINNER', 'SUBSCRIBER', 'SOCIAL',
    'PROSPECT', 'ANNOUNCEMENTS', 'MISC', 'PROJECTS'
];

export default class RedemptionHelper {

    static async onReaction(reaction, user) {
        const emoji = reaction.emoji.name;
        const isVoteEmoji = [RAW_EMOJIS.VOTE_FOR, RAW_EMOJIS.VOTE_AGAINST].indexOf(emoji) > -1;
        const channelID = reaction.message.channel.id;

        if (user.bot) return false;
        if (!isVoteEmoji) return false;
        if (channelID !== CHANNELS.INTRO.id) return false;

        // Process the vote
        this.processVote(reaction, user);
    }

    static async processVote(reaction, user) {
        const targetUser = reaction.message.author;

        let forVotes = 0;
        let againstVotes = 0;

        try {
            const voterMember = COOP.USERS._getMemberByID(user.id);
            const targetMember = COOP.USERS._getMemberByID(targetUser.id);

            // If member left, don't do anything.
            if (!targetMember) return false;
            
            // If targetMember has "member" role, don't do anything.
            if (COOP.USERS.hasRoleID(targetMember, ROLES.MEMBER.id)) return false;

            // Prevent PROSPECTS from letting people in.
            if (COOP.ROLES._idHasCode(user.id, 'PROSPECT'))
                return COOP.MESSAGES.selfDestruct(reaction.message, `${user.username} you can't vote as a PROSPECT. :dagger:`);

            // Calculate the number of required votes for the redemption poll.
            const reqForVotes = VotingHelper.getNumRequired(.025);
            const reqAgainstVotes = VotingHelper.getNumRequired(.015);
            
            // Refactor into a reaction guard! :D

            // Remove invalid reactions.
            if (!COOP.USERS.hasRoleID(voterMember, ROLES.MEMBER.id))
                return await reaction.users.remove(user.id)
            
            // Get existing reactions on message.
            reaction.message.reactions.cache.map(reactionType => {
                if (reactionType.emoji.name === RAW_EMOJIS.VOTE_FOR) forVotes = Math.max(0, reactionType.count - 1);
                if (reactionType.emoji.name === RAW_EMOJIS.VOTE_AGAINST) againstVotes = Math.max(0, reactionType.count - 1);
            });
            
            const votingStatusTitle = `<@${targetUser.id}>'s entry was voted upon!`;
            const votingStatusText = votingStatusTitle +
                `\nStill required: ` +
                `Entry ${RAW_EMOJIS.VOTE_FOR}: ${Math.max(0, reqForVotes - forVotes)} | ` +
                `Removal ${RAW_EMOJIS.VOTE_AGAINST}: ${Math.max(0, reqAgainstVotes - againstVotes)}`;
            

            
            // Handle user approved.
            if (forVotes >= reqForVotes) {
                // Add to database if not already in it.
                const savedUser = await COOP.USERS.loadSingle(targetMember.user.id);
                if (!savedUser)
                    await COOP.USERS.addToDatabase(targetMember.user.id, targetMember.user.username, targetMember.joinedDate);

                // Inform the user.
                try {
                    // TODO: Improve welcome text message to be more informative.
                    targetMember.send('Thank you for joining, we value your presence! You were voted into The Coop and now have **full access**!');
                } catch(e) {
                    console.log('Failed to inform user via DM of their removal.', targetUser);
                    console.error(e);
                }

                // Give intro roles
                const introRolesResult = await COOP.ROLES._addCodes(targetMember.user.id, STARTING_ROLES);
                console.log(introRolesResult);
                
                // Inform community.
                COOP.CHANNELS._codes(['ENTRY', 'TALK'], 
                    `${targetUser.username} approved based on votes!` +
                    `${forVotes ? `\n\n${RAW_EMOJIS.VOTE_FOR.repeat(forVotes)}` : ''}` +
                    `${againstVotes ? `\n\n${RAW_EMOJIS.VOTE_AGAINST.repeat(againstVotes)}` : ''}`
                );

               

            // Handle user rejected.
            } else if (againstVotes >= reqAgainstVotes) {
                // Inform community.
                COOP.CHANNELS._codes(['ENTRY', 'TALK'], `${targetUser.username} was voted out, removed and banned.`);

                // Inform the user.
                try {
                    targetMember.send('You were voted out of The Coop.');
                } catch(e) {
                    console.log('Failed to inform user via DM of their removal.', targetUser);
                    console.error(e);
                }

                // TODO: List current leaders/command for contact in order to appeal.
                await targetMember.ban();


            } else {
                // TODO: This way of preventing certain kinds of feedback spam should be refactored and reused everywhere.

                // Notify the relevant channels (throttle based on last entry vote time).
                const currentTime = +new Date();
                const lastVotetime = STATE.LAST_ENTRY_VOTE_TIME;
                if (!lastVotetime || lastVotetime < currentTime - 5000) {
                    STATE.LAST_ENTRY_VOTE_TIME = currentTime;
                    COOP.CHANNELS._codes(['ENTRY', 'TALK'], votingStatusText);
                }
            }
                
        } catch(e) {
            console.error(e);

            // Catch cannot send to user and notify them in approval channel, Cooper is HIGHLY recommended. ;)
        }
    }
}