import EMOJIS_CONFIG from "./config/emojis.json";
import RAW_EMOJIS_CONFIG from './config/rawemojis.json';
import KEY_MESSAGES_CONFIG from './config/keymessages.json';
import CHANNELS_CONFIG from './config/channels.json';
import ROLES_CONFIG from './config/roles.json';
import ITEMS_CONFIG from './config/items.json';

export const ITEMS = ITEMS_CONFIG;
export const EMOJIS = EMOJIS_CONFIG;
export const RAW_EMOJIS = RAW_EMOJIS_CONFIG;
export const KEY_MESSAGES = KEY_MESSAGES_CONFIG;
export const CHANNELS = CHANNELS_CONFIG;
export const ROLES = ROLES_CONFIG;

// Name explicitly on multi-line for easier IDE experience.
const CONFIG = {
    ITEMS,
    EMOJIS,
    RAW_EMOJIS,
    KEY_MESSAGES,
    CHANNELS,
    ROLES
};
export default CONFIG;