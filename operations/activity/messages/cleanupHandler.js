import { MESSAGES } from "../../../origin/coop";

export const emoji = '✝️';

// Allow people to delete messages but not key messages, lmao.
export default class CleanupHandler {

    static async onReaction(reaction, user) {
        if (reaction.emoji.name !== emoji) return false;
        
        const countVotes = 0;

        MESSAGES.selfDestruct(reaction.message, 'Trying to clean up message.');
    }

}