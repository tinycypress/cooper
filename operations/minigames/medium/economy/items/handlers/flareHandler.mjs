import CratedropMinigame from "../../../../small/cratedrop.mjs";

import { usedOwnedUsableGuard } from "../../itemCmdGuards.mjs";
import COOP, { STATE } from "../../../../../../origin/coop.mjs";



export default class FlareHandler {

    static async use(commandMsg, user) {
        const used = await usedOwnedUsableGuard(user, 'FLARE', 1, commandMsg);
        if (!used) return false;

        // Respond to usage result.
        const succeeded = STATE.CHANCE.bool({ likelihood: 45 });
        if (succeeded) CratedropMinigame.drop();

        const feedbackText = `${user.username} used a FLARE and ${succeeded ? 'successfully' : 'potentially'} triggered crate drop!`;
        COOP.CHANNELS.propagate(commandMsg, feedbackText, 'ACTIONS');
    }
   
}