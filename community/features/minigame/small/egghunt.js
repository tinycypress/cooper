import { map as _map, values as _values } from 'lodash';

import EMOJIS from '../../../../core/config/emojis.json';
import RAW_EMOJIS from '../../../../core/config/rawemojis.json';

import STATE from '../../../../core/state';
import DropTable from '../../items/droptable';

import UsersHelper from '../../../../core/entities/users/usersHelper';
import ItemsHelper from '../../items/itemsHelper';
import PointsHelper from '../../points/pointsHelper';
import ServerHelper from '../../../../core/entities/server/serverHelper';
import MessagesHelper from '../../../../core/entities/messages/messagesHelper';
import ChannelsHelper from '../../../../core/entities/channels/channelsHelper';


export const EGG_DATA = {
    TOXIC_EGG: {
        points: -10,
        emoji: EMOJIS.TOXIC_EGG
    },
    AVERAGE_EGG: {
        points: 3,
        emoji: EMOJIS.AVERAGE_EGG
    },
    RARE_EGG: {
        points: 10,
        emoji: EMOJIS.RARE_EGG
    },
    LEGENDARY_EGG: {
        points: 100,
        emoji: EMOJIS.LEGENDARY_EGG
    },
};


export default class EggHuntMinigame {
    
    static reactValid(reaction) {
        return this.isEgghuntDrop(reaction.message.content);
    }

    static isEgghuntDrop(messageStr) {
        const eggEmojiNames = _map(_values(EGG_DATA), "emoji");
        const emojiIdentifier = MessagesHelper.purifyEmojiIDStr(messageStr);
        return eggEmojiNames.includes(emojiIdentifier);
    }


    static onReaction(reaction, user) {
        try {
            const isCooperMessage = UsersHelper.isCooperMsg(reaction.message);
            const isEgghuntDrop = this.isEgghuntDrop(reaction.message.content);
            const hasEggRarity = this.calculateRarityFromMessage(reaction.message);
            const isEggCollectible = isCooperMessage && isEgghuntDrop && hasEggRarity;

            
            const isBombEmoji = reaction.emoji.name === RAW_EMOJIS.BOMB;
            const isBasketEmoji = reaction.emoji.name === RAW_EMOJIS.BASKET;

            // TODO: This isn't secure enough, need to check it's a coop emoji
            // SOLUTION: reaction.emoji.guild.id === COOP.id
            const isPanEmoji = reaction.emoji.name === 'frying_pan';

            if (isEggCollectible && isPanEmoji) this.fry(reaction, user);
            if (isEggCollectible && isBombEmoji) this.explode(reaction, user);

            // Prevent collection of dropped egg effects (cyclical).
            const wasDropped = ItemsHelper.isDroppedItemMsg(reaction.message);

            // Disallow egghunt effects on dropped eggs.
            const egghuntDroppedEgg = isEggCollectible && isBasketEmoji && !wasDropped;
            if (egghuntDroppedEgg) {
                // If collectible, collect emoji and wasn't dropped, allow collection.
                this.collect(reaction, user);
            }

        } catch(e) {
            console.error(e);
        }
    }

    static calculateRarityFromMessage(msg) {
        let eggRarity = null;

        if (msg.content.indexOf('average_egg') > -1) eggRarity = 'AVERAGE_EGG';
        if (msg.content.indexOf('rare_egg') > -1) eggRarity = 'RARE_EGG';
        if (msg.content.indexOf('legendary_egg') > -1) eggRarity = 'LEGENDARY_EGG';
        if (msg.content.indexOf('toxic_egg') > -1) eggRarity = 'TOXIC_EGG';

        return eggRarity;
    }

    static async processBombDrop(rarity, user) {
        // Ignore toxic eggs for now.
        if (rarity === 'TOXIC_EGG') return false;

        const tierLevel = rarity.replace('_EGG', '');
        const reward = DropTable.getRandomTieredWithQty(tierLevel);

        const actionTypeText = MessagesHelper.randomChars(7);
        const subjectText = `the ${tierLevel.toLowerCase()} egg`;
        const actionText = `${user.username} ${actionTypeText}'d items from bombing ${subjectText}...`;
        const emojiText = MessagesHelper.emojiText(EMOJIS[rarity]);
        const emojiItemText = MessagesHelper.emojiText(EMOJIS[reward.item]);
        const eventText = `${actionText} ${emojiText}\n${emojiItemText} ${reward.item}x${reward.qty}`;
        ChannelsHelper._postToChannelCode('ACTIONS', eventText, 2000);
        
        await ItemsHelper.add(user.id, reward.item, reward.qty);
    }

    // TODO: Add a small chance of bomb exploding on you.
    static async explode(reaction, user) {

        // Check if user has a bomb to use
        try {
            // TODO: Allow all other explosives to do this too.
            const bombQuantity = await ItemsHelper.getUserItemQty(user.id, 'BOMB');

            const rarity = this.calculateRarityFromMessage(reaction.message);
            const reward = EGG_DATA[rarity].points;
            const emoji = EGG_DATA[rarity].emoji;
            const channelName = reaction.message.channel.name;

            // Remove reaction by user without a bomb and prevent usage.
            if (bombQuantity <= 0) return await reaction.users.remove(user.id);

            // Remove bomb from user.
            await ItemsHelper.subtract(user.id, 'BOMB', 1);

            // User has enough eggs, blow egg up.
            const blownupEggMsg = await reaction.message.edit('💥');
            MessagesHelper.delayDelete(blownupEggMsg, 3333);

            // Share points with nearest 5 message authors.
            const channelMessages = reaction.message.channel.messages;
            const surroundingMsgs = await channelMessages.fetch({ around: reaction.message.id, limit: 40 });
            const aroundUsers = surroundingMsgs.reduce((acc, msg) => {
                const notIncluded = typeof acc[msg.author.id] === 'undefined';
                const notCooper = !UsersHelper.isCooperMsg(msg);
                if (notIncluded && notCooper) acc[msg.author.id] = msg.author;
                return acc;
            }, {});

            // Store points and egg collection data in database.
            const awardedUserIDs = Object.keys(aroundUsers);
            Promise.all(awardedUserIDs.map(userID => PointsHelper.addPointsByID(userID, reward)));

            // Add/update random item to user if it was a legendary egg
            this.processBombDrop(rarity, user);

            // Create feedback text from list of users.
            const usersRewardedText = awardedUserIDs.map(userID => aroundUsers[userID].username).join(', ');
            const emojiText = MessagesHelper.emojiText(emoji);
            const feedbackMsg = `${usersRewardedText} gained ${reward} points by being splashed by exploding egg ${emojiText}`.trim();
            
            // Add server notification in feed.
            ChannelsHelper.propagate(reaction.message, feedbackMsg, 'ACTIONS')

        } catch(e) {
            console.error(e);
        }
    }

    static async fry(reaction, user) {
        try {
            // Attempt to use the laxative item
            const didUsePan = await ItemsHelper.use(user.id, 'FRYING_PAN', 1);
    
            // Respond to usage result.
            if (didUsePan) {
                const rarity = this.calculateRarityFromMessage(reaction.message);
                const { points, emoji } = EGG_DATA[rarity];
    
                // Invert rewards, good egg cooked is wasting, bad egg cooked is rewarding.
                const actionReward = -points;   
    
                // Process the points change.
                const updatedPoints = await PointsHelper.addPointsByID(user.id, actionReward);
    
                // TODO: Create omelette item after being cooked.
    
                // Generate feedback test based on the changes.
                const feedbackText = `${user.username} fried <${emoji}>! ` +
                    `Resulting in ${actionReward} point(s) change. (${updatedPoints})`;
                
                // Delete the original egg, now it has been fried.
                await reaction.message.delete();

                setTimeout(async () => {
                    if (!ChannelsHelper.checkIsByCode(reaction.message.channel.id, 'FEED')) {

                        const feedbackMsg = await reaction.message.say(feedbackText);
                        MessagesHelper.delayReact(feedbackMsg, EMOJIS.FRYING_PAN, 1333);
                        MessagesHelper.delayDelete(feedbackMsg, 10000);
                    }
                    setTimeout(() => { ChannelsHelper._postToChannelCode('ACTIONS', feedbackText); }, 666);

                    // ChannelsHelper.propagate()
                }, 333)
            } else {
                const unableMsg = await reaction.message.say('Unable to use FRYING_PAN, you own none. :/');
                setTimeout(() => reaction.users.remove(user.id), 666);
                MessagesHelper.delayReact(unableMsg, EMOJIS.FRYING_PAN, 1333);
                MessagesHelper.delayDelete(unableMsg, 10000);
            }
        } catch(e) {
            console.log('Frying egg failed...');
            console.error(e);
        }
    }

    static async collect(reaction, user) {
        try {
            // Cleanup failed deletions.
            if (reaction.count > 2) {
                MessagesHelper.delayDelete(reaction.message, 333);
                return MessagesHelper.selfDestruct(reaction.message, 'That egg was just taken before you...', 0, 5000);
            }

            if (!UsersHelper.isCooper(user.id)) {
                const rarity = this.calculateRarityFromMessage(reaction.message);
                const reward = EGG_DATA[rarity].points;
                const rewardPolarity = reward > 0 ? '+' : '';
                const emoji = EGG_DATA[rarity].emoji;

                // Check the channel type or location of the action.
                let location = null;
                if (reaction.message.channel.type === 'dm') location = 'direct message'
                else location = `"${reaction.message.channel.name}" channel`;

                // Setup the text for feedback messages.
                const actionText = `<${emoji}>🧺 Egg Hunt! ${user.username}`;
                let acknowledgementMsgText =`${actionText} ${rewardPolarity}${reward} points!`.trim();
                let activityFeedMsgText = `${user.username} collected an egg in ${location}! <${emoji}>`.trim();

                // TODO: If Cooper is evil you break more pickaxes, axes, frying pans and eggs.

                if (STATE.CHANCE.bool({ likelihood: 83 })) {
                    // Store points and egg collection data in database.
                    const updated = await PointsHelper.addPointsByID(user.id, reward);
                    acknowledgementMsgText += ` (${updated})`;
                    
                    // Add/update egg item to user
                    await ItemsHelper.add(user.id, rarity, 1);

                    // Animate the egg collection.
                    const emojiText = MessagesHelper.emojiText(EGG_DATA[rarity].emoji);
                    const basketEmojiText = MessagesHelper.emojiText(RAW_EMOJIS.BASKET);
                    MessagesHelper.delayEdit(
                        reaction.message, 
                        `${emojiText}${basketEmojiText}💨\n\n${acknowledgementMsgText}`, 
                        333
                    );
                    MessagesHelper.delayDelete(reaction.message, 15000);
                } else {
                    acknowledgementMsgText = `${actionText} clumsily broke the egg, 0 points!`.trim();
                    activityFeedMsgText = `${user.username} broke an egg in ${location}! :( <${emoji}>`.trim();
                    MessagesHelper.delayEdit(reaction.message, acknowledgementMsgText, 666);
                    MessagesHelper.delayDelete(reaction.message, 15000);
                }

                // Provide record of event.
                ChannelsHelper._postToChannelCode('ACTIONS', activityFeedMsgText)                
            }
        } catch(e) {
            console.error(e);
        }
    }

    static async drop(rarity, dropText = null) {
        const server = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        const dropChannel = ChannelsHelper.fetchRandomTextChannel(server);
        
        if (dropChannel) {
            const randomDelayBaseMs = 30000;
            setTimeout(async () => {
                try {
                    const emojiText = MessagesHelper.emojiText(EGG_DATA[rarity].emoji);
                    const eggMsg = await dropChannel.send(emojiText);

                    // Define a base egg lifespan before cleanup occurs.
                    let eggLifespan = 60 * 10;

                    // Add collection action emoji.
                    MessagesHelper.delayReact(eggMsg, '🧺', 666);

                    // Remove toxic egg after few minutes so people aren't forced to take it.
                    if (rarity === 'TOXIC_EGG') eggLifespan = 60 * 2;
                    if (rarity === 'RARE_EGG') eggLifespan = 60 * 7;
                    if (rarity === 'LEGENDARY_EGG') eggLifespan = 60 * 7;

                    // TODO: If Cooper is evil, chance of destroying it immediately after.


                    // Schedule the deletion/cleanup of the dropped egg.
                    ServerHelper.addTempMessage(eggMsg, eggLifespan, 'EGG_HUNT', { rarity });
                    MessagesHelper.delayDelete(eggMsg, eggLifespan * 1000);

                    // If an annotation for the egg drop was provided, use it.
                    if (dropText) 
                        ChannelsHelper._postToChannelCode('ACTIONS', dropText);

                } catch(e) {
                    console.error(e);
                }
            }, STATE.CHANCE.natural({ min: randomDelayBaseMs, max: randomDelayBaseMs * 4 }));
        }
    }

    static async dmDrop(rarity) {
        try {
            const randomMember = await UsersHelper.random();
            if (randomMember) {
                const name = randomMember.user.username;
                const emojiText = MessagesHelper.emojiText(EGG_DATA[rarity].emoji);
    
                // Send via DM.
                const eggMsg = await randomMember.send(emojiText);
                MessagesHelper.delayReact(eggMsg, '🧺', 333);
    
                // Remove toxic egg after 5 minutes so people aren't forced to take it.
                if (rarity === 'TOXIC_EGG') MessagesHelper.delayDelete(eggMsg, 300000);
    
                // Provide feedback.
                let dropText = `${name} was sent an egg via DM! ${emojiText}`;
                if (rarity === 'LEGENDARY_EGG') dropText = 'OooOoOoOoooo... ' + dropText;
                ChannelsHelper._postToChannelCode('ACTIONS', dropText);
            }
        } catch(e) {
            console.error(e);
        }
    }

    static run() {        
        this.drop('AVERAGE_EGG', 'Whoops! I dropped an egg, but where...?');

        if (STATE.CHANCE.bool({ likelihood: 15 })) {
            this.drop('TOXIC_EGG', 'I dropped an egg, but where...? Tsk.');

            if (STATE.CHANCE.bool({ likelihood: 7.5 })) {
                this.drop('RARE_EGG', 'Funknes! Rare egg on the loose!');

                if (STATE.CHANCE.bool({ likelihood: 4.5 })) {
                    ChannelsHelper._postToChannelCode('ACTIONS', 'A legendary egg was dropped! Find and grab it before others can!');
                    this.drop('LEGENDARY_EGG');
                }
            }
        }

        // Small chance of rolling for a direct message egg.
        if (STATE.CHANCE.bool({ likelihood: 10 })) {
            if (STATE.CHANCE.bool({ likelihood: 1.35 })) this.dmDrop('TOXIC_EGG');
            if (STATE.CHANCE.bool({ likelihood: 3.85 })) this.dmDrop('AVERAGE_EGG');
            if (STATE.CHANCE.bool({ likelihood: 2.45 })) this.dmDrop('RARE_EGG');
            if (STATE.CHANCE.bool({ likelihood: 0.025 })) this.dmDrop('LEGENDARY_EGG');
        }

        // Small chance of bonus eggs being released.     
        if (STATE.CHANCE.bool({ likelihood: 4.5 })) {        
            // Calculate a number of bonus eggs.   
            let bonusEggsNum = STATE.CHANCE.natural({ min: 5, max: 25 });

            // Even rare chance of mass release.
            if (STATE.CHANCE.bool({ likelihood: 1.5 })) {
                bonusEggsNum = STATE.CHANCE.natural({ min: 10, max: 45 });
                ChannelsHelper._postToChannelCode('ACTIONS', 'Bonus eggs rolling!');
            }
            
            // Even rare(er) chance of mass(er) release.
            if (STATE.CHANCE.bool({ likelihood: .075 })) {
                bonusEggsNum = STATE.CHANCE.natural({ min: 20, max: 70 });
                ChannelsHelper._postToChannelCode('ACTIONS', 'Bonus eggs hurtling!');
            }

            // Drop the bonus average eggs.
            for (let i = 0; i < bonusEggsNum; i++) this.drop('AVERAGE_EGG', null);

            // Add in a mixture of toxic eggs.
            const toxicEggsMixupNum = STATE.CHANCE.natural({ min: 1, max: Math.floor(bonusEggsNum / 2.5) });
            for (let i = 0; i < toxicEggsMixupNum; i++) this.drop('TOXIC_EGG', null);
        }
    }
}
