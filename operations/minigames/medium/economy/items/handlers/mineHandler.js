import { MESSAGES, USERS } from "../../../../../../origin/coop";

export default class MineHandler {

    static async use(msg, user) {
        this.effect(msg, user);
    }

    static async onReaction(reaction, user) {
        // Check reaction emoji is MINE
        const reactEmojiFlake = `:${emoji.name}:${emoji.id}`;
        if (reactEmojiFlake !== COOP.ITEMS.codeToFlake('MINE')) return false;

        if (USERS.isCooper(user.id)) return false;

        this.effect(reaction.message, user);
    }

    static async effect(msgRef, user) {
        const mineText = MESSAGES.emojiCodeText('MINE');
        MESSAGES.selfDestruct(msgRef, mineText);

        MESSAGES.selfDestruct(msgRef, `${user.username} used a MINE ${mineText}.`);
    }
   
}