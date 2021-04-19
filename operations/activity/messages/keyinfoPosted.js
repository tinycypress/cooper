import { ROLES, USERS, CHANNELS as CHAN } from "../../../origin/coop";
import { CHANNELS } from "../../../origin/config";

export default class KeyInfoPosted {

    static async onMessage(msg) {
        if (msg.channel.id !== CHANNELS.KEY_INFO.id) return false;
        if (USERS.isCooperMsg(msg)) return false;
        if (msg.command !== null) return false;

        // Check if the user has role/leader or commander.
        const member = USERS._get(msg.author.id);
        if (!ROLES._has(member, 'LEADER') && !ROLES._has(member, 'COMMANDER'))
            return false;

        const keyInfoText = `**${CHAN.textRef('KEY_INFO')} update posted!**`;
        CHAN._codes(['TALK', 'FEED'], keyInfoText);        
    }

}