import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import { didUseGuard, ownEnoughGuard } from "../../../../core/entities/commands/guards/itemCmdGuards";
import EggHuntMinigame from "../../minigame/small/egghunt";


export default class LaxativeHandler {

    static async use(commandMsg, user) {       
        // Check the user even owns enough before proceeding. 
        const ownEnough = await ownEnoughGuard(user, commandMsg, 'LAXATIVE', 1)
        if (!ownEnough) return false;

        // Check consumed before firing effect.
        const didUse = await didUseGuard(user, 'LAXATIVE', commandMsg, '🍫');
        if (!didUse) return false;

        // Attempt to run egg drop. :D
        EggHuntMinigame.run();

        // Add feedback.
        const feedbackText = `${user.username} used laxative and potentially triggered egg drops!`;
        ChannelsHelper.propagate(commandMsg, feedbackText, 'ACTIONS');
    }
   
}