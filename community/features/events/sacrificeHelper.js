import EMOJIS from '../../../core/config/emojis.json';
import CHANNELS from '../../../core/config/channels.json';

import ChannelsHelper from '../../../core/entities/channels/channelsHelper';
import ServerHelper from '../../../core/entities/server/serverHelper';
import UsersHelper from '../../../core/entities/users/usersHelper';
import VotingHelper from '../../events/voting/votingHelper';
import MessagesHelper from '../../../core/entities/messages/messagesHelper';

import STATE from '../../../core/state';

import Chicken from '../../chicken';
import CooperMorality from '../minigame/small/cooperMorality';
import PointsHelper from '../points/pointsHelper';
import TimeHelper from '../server/timeHelper';
import ItemsHelper from '../items/itemsHelper';



export default class SacrificeHelper {
   
    static isReactionSacrificeVote(reaction, user) {
        const emoji = reaction.emoji.name;
        const isVoteEmoji = [EMOJIS.DAGGER, EMOJIS.SACRIFICE_SHIELD].indexOf(emoji) > -1;
        const channelID = reaction.message.channel.id;

        if (user.bot) return false;
        if (!isVoteEmoji) return false;
        if (channelID !== CHANNELS.SACRIFICE.id) return false;

        // Guards passed.
        return true;
    }



    static isBackDagger(reaction, user) {
        const emoji = reaction.emoji.name;
        const channelID = reaction.message.channel.id;
        const isSacrificeChannel = channelID === CHANNELS.SACRIFICE.id;
        const isDagger = MessagesHelper.emojiToUni(emoji) === MessagesHelper.emojiToUni(EMOJIS.DAGGER);

        if (isSacrificeChannel) return false;
        if (user.bot) return false;
        if (reaction.message.author.bot) return false;
        if (!isDagger) return false;

        // Guards passed.
        return true;
    }

    static async onReaction(reaction, user) {
        // Is back dagger
        if (this.isBackDagger(reaction, user)) {
            this.processBackDagger(reaction, user);
        }

        // Process the vote.
        if (this.isReactionSacrificeVote(reaction, user)) {
            this.processVote(reaction, user);
        }
    }


    static async processVote(reaction, user) {
        const guild = ServerHelper.getByCode(STATE.CLIENT, 'PROD');

        // Try to access sacrificee from message
        try {
            const sacrificeEmbedDesc = reaction.message.embeds[0].description;
            const sacrificeeID = /<@(\d+)>/.exec(sacrificeEmbedDesc)[1];
            const targetMember = await UsersHelper.fetchMemberByID(guild, sacrificeeID);

            // If target member is self, remove vote.
            if (user.id === targetMember.user.id) {
                // Remove vote.
                reaction.users.remove(user.id);

                // Warn.
                return MessagesHelper.selfDestruct(reaction.message, `${user.username} you can't vote for/against yourself. :dagger:`);
            }

            // If member left, don't do anything.
            if (!targetMember) return false;
            
            // Calculate the number of required votes for the redemption poll.
            const reqSacrificeVotes = VotingHelper.getNumRequired(guild, .025);
            const reqKeepVotes = VotingHelper.getNumRequired(guild, .02);
        
            // Get existing reactions on message.
            let sacrificeVotes = 0;
            let keepVotes = 0;
            reaction.message.reactions.cache.map(reactionType => {
                if (reactionType.emoji.name === EMOJIS.DAGGER) sacrificeVotes = Math.max(0, reactionType.count - 1);
                if (reactionType.emoji.name === EMOJIS.SACRIFICE_SHIELD) keepVotes = Math.max(0, reactionType.count - 1);
            });


            // Process votes with feedback for currently unprotected user.
            const rawKeepVotes = reqKeepVotes - keepVotes;
            if (rawKeepVotes > 0) {
                const remainingProtectVotes = Math.max(0, rawKeepVotes);
                const remainingSacrificeVotes = Math.max(0, reqSacrificeVotes - sacrificeVotes);   

                // Check if enough votes to sacrifice.
                if (remainingSacrificeVotes === 0) {
                    // Notify when user is voted out.
                    await ChannelsHelper._postToFeed(`<@${targetMember.id}> was sacrificed!`);
                    await targetMember.ban();

                } else {
                    // Provide feedback for user who is not currently protected or sacrificed.
                    ChannelsHelper.codeShout(reaction.message,
                        `**Remaining votes to sacrifice ${targetMember.user.username}**` +
                        `\n\n` +
                        `Protect: ${EMOJIS.SACRIFICE_SHIELD} ${remainingProtectVotes} ${EMOJIS.SACRIFICE_SHIELD}` +
                        `| Sacrifice: ${EMOJIS.DAGGER} ${remainingSacrificeVotes} ${EMOJIS.DAGGER}`, 
                        'FEED',
                        true
                    );
                }

                
            // Intercept latest vote granted protection to user.
            } else if (rawKeepVotes === 0 && reaction.emoji.name === EMOJIS.SACRIFICE_SHIELD) {
                await ChannelsHelper._postToFeed(`<@${targetMember.id}> was protected from sacrifice by votes!`);
            } 

        } catch(e) {
            console.error(e);
        }
    }


    static async processBackDagger(reaction, user) {
        const guild = ServerHelper.getByCode(STATE.CLIENT, 'PROD');

        // Calculate the number of required votes for the redemption poll.
        const reqSacrificeVotes = VotingHelper.getNumRequired(guild, .015);
    
        // Get existing reactions on message.
        let sacrificeVotes = 0;
        reaction.message.reactions.cache.map(reactionType => {
            const emoji = reactionType.emoji.name;
            if (MessagesHelper.emojiToUni(emoji) === MessagesHelper.emojiToUni(EMOJIS.DAGGER)) {
                sacrificeVotes = reactionType.count;
            }
        });

        // Limit this to only reaction to a certain count of emojis, fire once.
        if (sacrificeVotes === reqSacrificeVotes) {
            const targetID = reaction.message.author.id;
            const targetMember = await UsersHelper.fetchMemberByID(guild, targetID);

            // TODO: Award points to backstabbers
            // TODO: Award points for successfully removing a backstabbed member.
            // TODO: Also reward points for approving/rejecting an incoming member (reward more for rejection)
            // TODO: limit number of sacrifices to a maximum of five by checking the number of messages in the sacrifice channel


            await this.offer(targetMember.user);

            setTimeout(async () => {
                // May have got stabbed more in the past 3 seconds.
                // TODO: Implement backstabbers list.
                let updatedNumVotes = sacrificeVotes;
                const backstabbers = [];
                reaction.message.reactions.cache.map(reactionType => {
                    const emoji = reactionType.emoji.name;
                    if (emoji === EMOJIS.DAGGER) updatedNumVotes = reactionType.count;
                });

                const backstabMsg = await reaction.message.say(
                    `${targetMember.user.username} got backstabbed! ${EMOJIS.DAGGER.repeat(updatedNumVotes)}`
                );
            }, 3000);
        }
    }


    static async getLastSacrificeSecs(userID) {
        const lastSacSecs = await UsersHelper.getField(userID, 'last_sacrificed_secs');
        return lastSacSecs;
    }


    static async offer(user) {
        // Check last sacrifice time
        const lastSacSecs = await this.getLastSacrificeSecs(user.id);
        
        // If happened within past week, prevent.
        const lastWeek = TimeHelper._secs() - ((60 * 60) * 24) * 7;
        // Ignore null lastSacSecs, these players have never been sacrificed before... no reason not to choose them. :D
        if (lastSacSecs !== null && lastSacSecs >= lastWeek) {
            const sparedText = `${user.username} was considered for sacrifice but spared.`;
            return ChannelsHelper._postToFeed(sparedText);
        }

        // Show some basic user statistics on the sacrifice message.
        let lastMessageFmt = 'unknown';

        // Try to access and format last_msg_secs data.v
        const lastMsgSecs = await UsersHelper.getField(user.id, 'last_msg_secs');
        if (lastMsgSecs) lastMessageFmt = TimeHelper.secsLongFmt(lastMsgSecs);

        const totalMsgsSent = await UsersHelper.getField(user.id, 'total_msgs');
        const points = await PointsHelper.getPointsByID(user.id);
        const totalItems = await ItemsHelper.getUserTotal(user.id);

        const cooperMood = await CooperMorality.load();

        let moodText = '';
        const tenRoll = STATE.CHANCE.bool({ likelihood: 6 });
        const twentyRoll = STATE.CHANCE.bool({ likelihood: 4 });
        const twoRoll = STATE.CHANCE.bool({ likelihood: 2 });
        const oneRoll = STATE.CHANCE.bool({ likelihood: 1 });

        if (tenRoll && cooperMood === 'EVIL') moodText = ' (and I hope you are)';
        if (twentyRoll && cooperMood === 'EVIL') moodText = ' lol';
        if (twoRoll && cooperMood === 'EVIL') moodText = ' (been looking forward to this one)';
        if (oneRoll && cooperMood === 'EVIL') moodText = ', ha';

        if (tenRoll && cooperMood === 'GOOD') moodText = ' (and I hope they don\'t)';
        if (twentyRoll && cooperMood === 'GOOD') moodText = ' ;(';
        if (twoRoll && cooperMood === 'GOOD') moodText = ' nooooooooo';
        if (oneRoll && cooperMood === 'GOOD') moodText = ' violence never solved anything.';

        if (tenRoll && cooperMood === 'NEUTRAL') moodText = ' it\'s a shame it had to come to this.';
        if (twentyRoll && cooperMood === 'NEUTRAL') moodText = ' this is Coop standard HR practise';
        if (twoRoll && cooperMood === 'NEUTRAL') moodText = ' it is what it is';
        if (oneRoll && cooperMood === 'NEUTRAL') moodText = ' just awaiting the paperwork';
        if (oneRoll && twentyRoll && cooperMood === 'NEUTRAL') moodText = ' all sacrificial rights reserved, The Coop';

        // Add message to sacrifice
        const sacrificeEmbed = MessagesHelper.embed({ 
            title: `${user.username}, you may be sacrificed${moodText}!`,
            description: 
                `**Decide <@${user.id}>'s fate**: React to choose! Dagger (remove) OR Shield (keep)!\n` +
                `\n**Member Stats:**\n` +
                `_Last message sent: ${lastMessageFmt}_\n` + 
                `_Total messages sent: ${totalMsgsSent}_\n` +
                `_Total points: ${points}_\n` +
                `_Total items: ${totalItems}_`,
            thumbnail: UsersHelper.avatar(user),
            footerText: 'The best Discord community to be sacrificed from!',
        });

        // Schedule end of message and reaction voting (24hr)
        const sacrificeMsg = await ChannelsHelper._postToChannelCode('SACRIFICE', sacrificeEmbed);
        ServerHelper.addTempMessage(sacrificeMsg, 60 * 60 * 24);

        // Update the user's latest recorded sacrifice time.
        await UsersHelper.updateField(user.id, 'last_sacrificed_secs', TimeHelper._secs());

        // Post to feed
        setTimeout(() => {
            const sacrificeMsgText = `${user.username} is being considered for sacrifice! Vote now! <#${CHANNELS.SACRIFICE.id}>`
            ChannelsHelper._postToFeed(sacrificeMsgText);

            setTimeout(() => {
                const begPromptMsgText = `<@${user.id}> you may beg to be spared from <#${CHANNELS.SACRIFICE.id}> here.`;
                ChannelsHelper._postToChannelCode('TALK', begPromptMsgText);
            }, 1500);
        }, 1500);

        // Add reactions for voting
        MessagesHelper.delayReact(sacrificeMsg, EMOJIS.DAGGER, 1500);
        MessagesHelper.delayReact(sacrificeMsg, EMOJIS.SACRIFICE_SHIELD, 2000);

        return true;
    }

    // Sacrifice random member if less than five people are being sacrificed and the member exists
    static async random() {
        try {
            // Select a member at random.
            const member = await UsersHelper.random();

            // Access the sacrifice channel for sacrifice data.
            const sacrificeChannel = STATE.CLIENT.channels.cache.get(CHANNELS.SACRIFICE.id);
            const sacrificeOffers = await sacrificeChannel.messages.fetch({ limit: 3 });

            // If space for another offer, offer one.
            if (member && sacrificeOffers.size <= 3) this.offer(member.user);

        } catch(e) {
            console.log('Error sacrificing random member!');
            console.error(e);
        }
    }
}