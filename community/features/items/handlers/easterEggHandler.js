import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import { didUseGuard, ownEnoughGuard } from "../../../../core/entities/commands/guards/itemCmdGuards";
import MessagesHelper from "../../../../core/entities/messages/messagesHelper";
import EggHuntMinigame from "../../minigame/small/egghunt";
import ItemsHelper from "../itemsHelper";


export default class EasterEggHandler {

    static async use(commandMsg, user) {       
        // Check the user even owns enough before proceeding. 
        const ownEnough = await ownEnoughGuard(user, commandMsg, 'EASTER_EGG', 1)
        if (!ownEnough) return false;

        // Check consumed before firing effect.
        const didUse = await didUseGuard(user, 'EASTER_EGG', commandMsg);
        if (!didUse) return false;

        // Calculate reward.
        const rewardBase = await ItemsHelper.count('COOP_POINT');
        const reward = rewardBase * .25;

        // Add the points to the user.
        ItemsHelper.add(user.id, 'COOP_POINT', reward);

        // Add feedback.
        const coopEmoji = MessagesHelper._displayEmojiCode('COOP_POINT');
        const eggEmoji = MessagesHelper._displayEmojiCode('EASTER_EGG');
        const feedbackText = `**${eggEmoji.repeat(2)} ${user.username} used their easter egg!**\n\n` +
            `They gained ${reward}x${coopEmoji} (25% of the average CP per beak (${rewardBase}))!`;

        ChannelsHelper.propagate(commandMsg, feedbackText, 'ACTIONS');
    }
   
}