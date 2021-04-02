import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import MessagesHelper from "../../../../core/entities/messages/messagesHelper";
import STATE from "../../../../core/state";

import CratedropMinigame from "../../minigame/small/cratedrop";
import ItemsHelper from "../itemsHelper";
import UsableItemHelper from "../usableItemHelper";

export default class FlareHandler {

    static async use(commandMsg, user) {
        // Attempt to use the laxative item
        const didUseFlare = await UsableItemHelper.use(user.id, 'FLARE', 1);

        // Respond to usage result.
        if (didUseFlare) {
            if (STATE.CHANCE.bool({ likelihood: 45 })) setTimeout(() => CratedropMinigame.drop(), 333);

            const feedbackText = `${user.username} used a FLARE and potentially triggered crate drop!`;
            ChannelsHelper.propagate(commandMsg, feedbackText, 'ACTIONS');
        }
        else {
            const unableMsg = await commandMsg.say('Unable to use FLARE, you own none. :/');
            MessagesHelper.delayReact(unableMsg, '🪓', 1333);
            MessagesHelper.delayDelete(unableMsg, 10000);
        }
    }
   
}