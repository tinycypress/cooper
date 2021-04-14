import { CHANNELS } from "../../../origin/coop"

export function status() {
    CHANNELS._postToChannelCode('TALK', 'CHECKING STATUS LOYALTY!');
};