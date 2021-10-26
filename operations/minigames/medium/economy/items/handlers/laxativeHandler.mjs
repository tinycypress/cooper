import EggHuntMinigame from "../../../../small/egghunt.mjs";

import { usedOwnedUsableGuard } from "../../itemCmdGuards.mjs";
import COOP, { STATE } from "../../../../../../origin/coop.mjs";


export default class LaxativeHandler {

    static async use(commandMsg, user) {       
        const used = await usedOwnedUsableGuard(user, 'LAXATIVE', 1, commandMsg);
        if (!used) return false;

        // Attempt to run egg drop. :D
        const succeeded = STATE.CHANCE.bool({ likelihood: 45 });
        if (succeeded) 
            EggHuntMinigame.run();

        // Add chance to do bonus eggs! Refactor in egg hunt.

        // Add feedback.
        // TODO: 20% chanceof spawning in channel used (add to FLARE too)
        const feedbackText = `${user.username} used laxative and ${succeeded ? 'successfully' : 'potentially'} triggered egg drops!`;
        COOP.CHANNELS.propagate(commandMsg, feedbackText, 'ACTIONS');
    }
   
}