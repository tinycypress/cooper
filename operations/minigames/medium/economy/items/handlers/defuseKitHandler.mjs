import { MESSAGES, USERS, ITEMS } from "../../../../../../origin/coop.mjs";

export default class DefuseKitHandler {

    static async use(msg, user) {
        this.effect(msg, user);
    }

    static async onReaction(reaction, user) {
        // Check reaction emoji is DEFUSE_KIT
        const reactEmojiFlake = `:${reaction.emoji.name}:${reaction.emoji.id}`;
        if (reactEmojiFlake !== ITEMS.codeToFlake('DEFUSE_KIT')) return false;

        if (USERS.isCooper(user.id)) return false;

        this.effect(reaction.message, user);
    }

    static async effect(msgRef, user) {
        const mineText = MESSAGES.emojiCodeText('DEFUSE_KIT');
        MESSAGES.selfDestruct(msgRef, mineText, 3333, 60000);

        MESSAGES.selfDestruct(msgRef, `${user.username} used a DEFUSE_KIT ${mineText}.`, 0, 6666);
    }
   
}