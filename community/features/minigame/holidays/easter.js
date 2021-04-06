import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import MessagesHelper from "../../../../core/entities/messages/messagesHelper";
import ServerHelper from "../../../../core/entities/server/serverHelper";
import STATE from "../../../../core/state";
import EMOJIS from "../../../../core/config/emojis.json";
import ItemsHelper from "../../items/itemsHelper";
import UsersHelper from "../../../../core/entities/users/usersHelper";
import UsableItemHelper from "../../items/usableItemHelper";

const _easterEggEmoji = MessagesHelper._displayEmojiCode('EASTER_EGG');

export default class EasterMinigame {

    // Burn metal ore into metal
    static async onReaction(reaction, user) {
        // console.log('Confirm basket matches this.');
        // console.log(reaction.emoji);

        // if (this.isPickupable(reaction, user)) {
        //     this.pickup(reaction, user);
        // }

        // Check if basket, but allow regular pickup to function


            // Find item code via emoji/emoji ID (trimmed) string in comparison to emojis.json.
            // const emojiID = MessagesHelper.getEmojiIdentifier(reaction.message);
            // const itemCode = ItemsHelper.emojiToItemCode(emojiID);
                
            // // If invalid item code or not usable, don't allow pick up event.
            // if (!itemCode || !this.isUsable(itemCode))
            //     return MessagesHelper.selfDestruct(reaction.message,
            //         `${user.username} you can't pick that up. (${itemCode})`
            //     );

        // // Reject all N/A
        // if (!UsersHelper.isCooper(reaction.message.author.id)) return false;
        // if (UsersHelper.isCooper(user.id)) return false;
        // if (reaction.message.content.trim() !== '🌋') return false;
        // if (reaction.emoji.name !== 'metal_ore') return false;
        

        // // Declare they're chasing the rabbit.
        // const attemptText = `${_easterEggEmoji} ${user.username} is attempting to collect easter eggs...`;
        // MessagesHelper.selfDestruct(reaction.message, attemptText, 333, 3333);

        // try {
        //     setTimeout(async () => {
        //         // Add multiplier effect.
        //         const collectedNum = Math.max(reaction.count - 1, 1);
    
        //         // Add rewards to user.
        //         await ItemsHelper.add(user.id, 'EASTER_EGG', collectedNum);
                
        //         // Create record in channel and in actions.
        //         const rewardText = `${user.username} collected ${collectedNum} easter eggs from the holiday spawn! ` 
        //             + _easterEggEmoji.repeat(collectedNum);
        //         ChannelsHelper.propagate(reaction.message, rewardText, 'ACTIONS');

        //         // Delete it to prevent further duplication.
        //         MessagesHelper.delayDelete(reaction.message, 0);
        //     }, 5000);

        // } catch(e) {
        //     console.log('Failure reacting to easter spawn (reaction).');
        //     console.error(e);
        // }
    }

    // TODO: Consider getting a server time from somewhere to standardise all time?
    // TODO: Detect easter with last_easter detected column, that way can launch a message. :D
    static isEaster() {
        const dateNow = new Date();
        const year = dateNow.getFullYear();
        const century = Math.floor(year / 100);

        const goldenNum = year % 19;

        const nextCentury = year % 100;
        const quadrennial = Math.floor(century / 4); 
        const quadrennialYear = century % 4;

        // Relabel if feeling brave enough to annotate Gauss's Easter algorithm.
        const f = Math.floor((century + 8) / 25);
        const g = Math.floor((century - f + 1) / 3); 
        const startMonthOffset = (19 * goldenNum + century - quadrennial - g + 15) % 30;
        
        const i = Math.floor(nextCentury / 4);
        const k = nextCentury % 4;
        const l = (32 + 2 * quadrennialYear + 2 * i - startMonthOffset - k) % 7;
        const m = Math.floor((goldenNum + 11 * startMonthOffset + 22 * l) / 451);
        const n0 = (startMonthOffset + l + 7 * m + 114)
        
        // Check if easter.
        const easterMonth = Math.floor(n0 / 31) - 1;
        const easterDay = n0 % 31 + 1;
        const easterDate = new Date(year, easterMonth, easterDay);
        return (
            dateNow.getMonth() === easterDate.getMonth() 
            && 
            dateNow.getDate() === easterDate.getDate()
        );
    }

    static async run() {
        // Only spawn on easter
        if (this.isEaster()) 
            ItemsHelper.drop(ChannelsHelper._getCode('TALK'), 'EASTER_EGG', 30);

            // TODO: Announce current easter and mass drop for 2 hours.
            // setInterval(() => {
            //     // listenReactions(EasterMinigame.onReaction);
            //     EasterMinigame.run();
    
            //     for (let i = 0; i < 10; i++) {
            //         const likelihood = i * 5;
            //         const randomDelayMax = STATE.CHANCE.natural({ min: 5000, max: 60000 });
            //         if (STATE.CHANCE.bool({ likelihood })) {
            //             setTimeout(() => EasterMinigame.run(), randomDelayMax * i);
            //         }
            //     }
    
        
            //     // Format and output text.
            //     const emojiText = MessagesHelper._displayEmojiCode('EASTER_EGG');
            //     const talk = ChannelsHelper._getCode('TALK');
            //     const keyInfo = ChannelsHelper._getCode('KEY_INFO');
            //     MessagesHelper.selfDestruct(keyInfo, `${emojiText.repeat(3)} May drop one in talk now... ;) <#${talk.id}>`, 0, 30000);
            // }, (2 * (60)) * 1000);    
    }


}