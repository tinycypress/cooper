import CratedropMinigame from "../../../../small/cratedrop";

import { usedOwnedUsableGuard } from "../../itemCmdGuards";
import COOP, { STATE } from "../../../../../../origin/coop";



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