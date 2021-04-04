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

    static isEaster() {
        var curdate = new Date();
        var year = curdate.getFullYear();
        var a = year % 19;
        var b = Math.floor(year / 100);
        var c = year % 100;
        var d = Math.floor(b / 4); 
        var e = b % 4;
        var f = Math.floor((b + 8) / 25);
        var g = Math.floor((b - f + 1) / 3); 
        var h = (19 * a + b - d - g + 15) % 30;
        var i = Math.floor(c / 4);
        var k = c % 4;
        var l = (32 + 2 * e + 2 * i - h - k) % 7;
        var m = Math.floor((a + 11 * h + 22 * l) / 451);
        var n0 = (h + l + 7 * m + 114)
        var n = Math.floor(n0 / 31) - 1;
        var p = n0 % 31 + 1;
        var date = new Date(year,n,p);
        return ((curdate.getMonth() == date.getMonth())&&(curdate.getDate() == date.getDate()));
    }

    static async run() {
        // TODO: Only spawn on easter
        if (this.isEaster())
            ItemsHelper.drop(ChannelsHelper._getCode('TALK'), 'EASTER_EGG', 30);
    }


}