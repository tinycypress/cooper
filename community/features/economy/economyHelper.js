import ItemTotalCommand from "../../../commands/economy/itemTotal";
import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import STATE from "../../../core/state";
import UsableItemHelper from "../items/usableItemHelper";

export default class EconomyHelper {

    static async circulation() {
        const items = UsableItemHelper.getUsableItems();
        const itemCode = STATE.CHANCE.pickone(items);
        const stat = await ItemTotalCommand.getStat(itemCode);

        await ChannelsHelper._postToChannelCode('ACTIONS', stat);
    }

}