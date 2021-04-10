import { USABLE, CHANNELS, STATE } from "../../../../origin/coop";

import ItemTotalCommand from "../../../../commands/economy/itemTotal";


export default class EconomyHelper {

    static async circulation() {
        const items = USABLE.getUsableItems();
        const itemCode = STATE.CHANCE.pickone(items);
        const stat = await ItemTotalCommand.getStat(itemCode);

        await CHANNELS._postToChannelCode('ACTIONS', stat);
    }

}