import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import { usedOwnedUsableGuard } from "../../../../core/entities/commands/guards/itemCmdGuards";
import STATE from "../../../../core/state";
import EggHuntMinigame from "../../minigame/small/egghunt";


export default class LaxativeHandler {

    static async use(commandMsg, user) {       
        const used = await usedOwnedUsableGuard(user, 'LAXATIVE', 1, commandMsg);;
        if (!used) return false;

        // Attempt to run egg drop. :D
        const succeeded = STATE.CHANCE.bool({ likelihood: 45 });
        if (succeeded) 
            EggHuntMinigame.run();

        // Add chance to do bonus eggs! Refactor in egg hunt.

        // Add feedback.
        const feedbackText = `${user.username} used laxative and ${succeeded ? 'successfully' : 'potentially'} triggered egg drops!`;
        ChannelsHelper.propagate(commandMsg, feedbackText, 'ACTIONS');
    }
   
}