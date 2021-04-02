import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import MessagesHelper from "../../../../core/entities/messages/messagesHelper";
import EggHuntMinigame from "../../minigame/small/egghunt";
import ItemsHelper from "../itemsHelper";
import UsableItemHelper from "../usableItemHelper";

export default class LaxativeHandler {

    static async use(commandMsg, user) {
        // Attempt to use the laxative item
        const didUseLax = await UsableItemHelper.use(user.id, 'LAXATIVE', 1);

        // Respond to usage result.
        if (didUseLax) {
            const feedbackText = `${user.username} used laxative and potentially triggered egg drops!`;
            ChannelsHelper.propagate(commandMsg, feedbackText, 'ACTIONS');

            // Attempt to run egg drop. :D
            EggHuntMinigame.run();
            
        } else {
            const unableMsg = await commandMsg.say('Unable to use LAXATIVE, you own none. :/');
            MessagesHelper.delayReact(unableMsg, '🍫', 1333);
            MessagesHelper.delayDelete(unableMsg, 10000);
        }
    }
   
}