import TradingHelper from '../../operations/minigames/medium/economy/items/tradingHelper';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';

export default class TradeFindCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'conversion',
			group: 'economy',
			memberName: 'conversion',
			aliases: ['cnv'],
			description: 'This command lets you find the conversion rate between items based on open trades',
			details: `Details of the conversion command`,
			examples: ['conversion', '!conversion laxative'],
			args: [
				{
					key: 'offerItemCode',
					prompt: 'Which item_code are you comparing?',
					type: 'string',
					default: ''
				},
				{
					key: 'receiveItemCode',
					prompt: 'Which item_code do you want to compare against?',
					type: 'string',
					default: ''
				}
			],
		});
	}

	async run(msg, { offerItemCode, receiveItemCode }) {
		super.run(msg);

		offerItemCode = COOP.ITEMS.interpretItemCodeArg(offerItemCode);
		receiveItemCode = COOP.ITEMS.interpretItemCodeArg(receiveItemCode);

		// Check if offer item code is default (all) or valid.
		if (!offerItemCode)
			return COOP.MESSAGES.selfDestruct(msg, `Invalid item code (${offerItemCode}).`, 0, 5000);

		// Check if receive item code is default (all) or valid.
		if (!receiveItemCode)
			return COOP.MESSAGES.selfDestruct(msg, `Invalid item code (${receiveItemCode}).`, 0, 5000);

		// If receive item code has been given, make sure only those matching returned.
		const matches = await TradingHelper.findOfferReceiveMatches(offerItemCode, receiveItemCode);
		
		// Return no matching trades warning.
		if (matches.length === 0) {
			const noMatchesStr = `No conversion data/existing trades including ${offerItemCode} for ${receiveItemCode}.`;
			return COOP.MESSAGES.selfDestruct(msg, noMatchesStr, 0, 5000);
		}
		const conversionRate = await TradingHelper.conversionRate(offerItemCode, receiveItemCode);
		return COOP.MESSAGES.selfDestruct(msg, `1 ${offerItemCode} = ${conversionRate}* _(* Based on open trades)_.`, 0, 20000);

    }
    
}