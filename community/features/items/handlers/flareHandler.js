import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import { usedOwnedUsableGuard } from "../../../../core/entities/commands/guards/itemCmdGuards";
import MessagesHelper from "../../../../core/entities/messages/messagesHelper";
import STATE from "../../../../core/state";

import CratedropMinigame from "../../minigame/small/cratedrop";
import UsableItemHelper from "../usableItemHelper";

export default class FlareHandler {

    static async use(commandMsg, user) {
        const used = await usedOwnedUsableGuard(user, 'FLARE', 1, commandMsg);
        if (!used) return false;

        // Respond to usage result.
        const succeeded = STATE.CHANCE.bool({ likelihood: 45 });
        if (succeeded) CratedropMinigame.drop();

        const feedbackText = `${user.username} used a FLARE and ${succeeded ? 'successfully' : 'potentially'} triggered crate drop!`;
        ChannelsHelper.propagate(commandMsg, feedbackText, 'ACTIONS');
    }
   
}