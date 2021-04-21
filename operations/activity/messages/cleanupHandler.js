import { KEY_MESSAGES } from "../../../origin/config";
import { MESSAGES, ROLES, USERS } from "../../../origin/coop";

export const cleanEmoji = '✝️';

// Allow people to delete messages but not key messages, lmao.
export default class CleanupHandler {

    static async onReaction({ emoji, message: msg }, user) {
        if (emoji.name !== cleanEmoji) return false;
        if (USERS.isCooper(user.id)) return false;

        // Prevent non-members trying to delete content.
        // TODO: Add member role ping/hyperlink
        const memberReqText = `<@${user.id}>, member role is required for that action. ${cleanEmoji}`;
        const member = USERS._getMemberByID(user.id);
        if (!ROLES._has(member, 'MEMBER'))
            return MESSAGES.silentSelfDestruct(msg, memberReqText);

        // Protect key messages and other from attempts to sabotage.
        const linkDel = MESSAGES.link(msg);
        const matchFn = keyMsgKey => KEY_MESSAGES[keyMsgKey] === linkDel;
        const matches = Object.keys(KEY_MESSAGES).filter(matchFn);
        const protectKeyText = `${cleanEmoji} Cannot democratically delete a key message.`;
        if (matches.length > 0) MESSAGES.silentSelfDestruct(msg, protectKeyText);

        const countVotes = 0;

        MESSAGES.silentSelfDestruct(msg, `${cleanEmoji} Trying to clean up message. ${cleanEmoji}`);
    }

}