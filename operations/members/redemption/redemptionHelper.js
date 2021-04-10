import VotingHelper from "../../activity/redemption/votingHelper";

import COOP, { SERVER, STATE } from "../../../origin/coop";
import { EMOJIS, ROLES, CHANNELS } from '../../../origin/config';


export const STARTING_ROLES = [
    'MEMBER', 'BEGINNER', 'SUBSCRIBER', 'SOCIAL',
    'PROSPECT', 'ANNOUNCEMENTS', 'MISC', 'PROJECTS'
];

export default class RedemptionHelper {

    static async onReaction(reaction, user) {
        const emoji = reaction.emoji.name;
        const isVoteEmoji = [EMOJIS.VOTE_FOR, EMOJIS.VOTE_AGAINST].indexOf(emoji) > -1;
        const channelID = reaction.message.channel.id;

        if (user.bot) return false;
        if (!isVoteEmoji) return false;
        if (channelID !== CHANNELS.INTRO.id) return false;

        // Process the vote
        this.processVote(reaction, user);
    }

    static async processVote(reaction, user) {
        const guild = SERVER.getByCode(STATE.CLIENT, 'PROD');

        const targetUser = reaction.message.author;

        let forVotes = 0;
        let againstVotes = 0;

        try {
            const voterMember = await COOP.USERS.fetchMemberByID(guild, user.id);
            const targetMember = await COOP.USERS.fetchMemberByID(guild, targetUser.id);

            // If member left, don't do anything.
            if (!targetMember) return false;
            
            // If targetMember has "member" role, don't do anything.
            if (COOP.USERS.hasRoleID(targetMember, ROLES.MEMBER.id)) return false;
            
            // Calculate the number of required votes for the redemption poll.
            const reqForVotes = VotingHelper.getNumRequired(.025);
            const reqAgainstVotes = VotingHelper.getNumRequired(.015);
            
            // Remove invalid reactions.
            if (!COOP.USERS.hasRoleID(voterMember, ROLES.MEMBER.id)) {
                return await reaction.users.remove(user.id)
            }
            
            // Get existing reactions on message.
            reaction.message.reactions.cache.map(reactionType => {
                if (reactionType.emoji.name === EMOJIS.VOTE_FOR) forVotes = Math.max(0, reactionType.count - 1);
                if (reactionType.emoji.name === EMOJIS.VOTE_AGAINST) againstVotes = Math.max(0, reactionType.count - 1);
            });
            
            const votingStatusTitle = `<@${targetUser.id}>'s entry was voted upon!`;
            const votingStatusText = votingStatusTitle +
                `\nStill required: ` +
                `Entry ${EMOJIS.VOTE_FOR}: ${Math.max(0, reqForVotes - forVotes)} | ` +
                `Removal ${EMOJIS.VOTE_AGAINST}: ${Math.max(0, reqAgainstVotes - againstVotes)}`;
            

            
            // Handle user approved.
            if (forVotes >= reqForVotes) {
                // Add to database
                COOP.USERS.addToDatabase(targetMember.user.id, targetMember.joinedDate);

                // Give intro roles
                COOP.ROLES._addManyToMember(targetMember, STARTING_ROLES);
                
                // Inform community.
                COOP.CHANNELS.codes(['ENTRY', 'TALK'], 
                    `${targetUser.username} approved based on votes!` +
                    `${forVotes ? `\n\n${EMOJIS.VOTE_FOR.repeat(forVotes)}` : ''}` +
                    `${againstVotes ? `\n\n${EMOJIS.VOTE_AGAINST.repeat(againstVotes)}` : ''}`
                );

                // TODO: Improve welcome text message to be more informative.
                targetMember.send('You were voted into The Coop and now have full access!');

            // Handle user rejected.
            } else if (againstVotes >= reqAgainstVotes) {
                // Inform community.
                COOP.CHANNELS.codes(['ENTRY', 'TALK'], `${targetUser.username} was voted out, removed and banned.`);

                // TODO: List current leaders/command for contact in order to appeal.
                await targetMember.ban();

                // Inform the user.
                targetMember.send('You were voted out of The Coop.');

            } else {
                // TODO: This way of preventing certain kinds of feedback spam should be refactored and reused everywhere.

                // Notify the relevant channels (throttle based on last entry vote time).
                const currentTime = +new Date();
                const lastVotetime = STATE.LAST_ENTRY_VOTE_TIME;
                if (!lastVotetime || lastVotetime < currentTime - 5000) {
                    STATE.LAST_ENTRY_VOTE_TIME = currentTime;
                    COOP.CHANNELS.codes(['ENTRY', 'TALK'], votingStatusText);
                }
            }
                
        } catch(e) {
            console.error(e);

            // Catch cannot send to user and notify them in approval channel, Cooper is HIGHLY recommended. ;)
        }
    }
}