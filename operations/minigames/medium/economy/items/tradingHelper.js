
import { KEY_MESSAGES } from "../../../../../origin/config";
import { MESSAGES, TIME } from "../../../../../origin/coop";

export default class TradingHelper {

    static async updateChannel() {
        // Update message at top of trades :), fuck your sarcastic comments.
        const dateFmt = TIME.secsLongFmt(Date.now() / 1000);
        const editResult = await MESSAGES.editByLink(KEY_MESSAGES.trade_info, 'Trade Message Updated ' + dateFmt);
        return editResult;
    }

}