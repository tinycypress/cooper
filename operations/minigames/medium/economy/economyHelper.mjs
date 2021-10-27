import { USABLE, CHANNELS, STATE } from "../../../../origin/coop.mjs";

// import ItemTotalCommand from "../../../../commands/economy/itemTotal.mjs";


export default class EconomyHelper {

    static async circulation() {
        const items = USABLE.getUsableItems();
        const itemCode = STATE.CHANCE.pickone(items);
        // const stat = await ItemTotalCommand.getStat(itemCode);

        const stat = 'This needs recaculating due to Discordjs V13 :facepalm:';

        await CHANNELS._postToChannelCode('TALK', stat);
    }

}