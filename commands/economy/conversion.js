import TradeHelper from '../../community/features/economy/tradeHelper';
import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

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

		offerItemCode = ItemsHelper.interpretItemCodeArg(offerItemCode);
		receiveItemCode = ItemsHelper.interpretItemCodeArg(receiveItemCode);

		// Check if offer item code is default (all) or valid.
		if (!offerItemCode)
			return MessagesHelper.selfDestruct(msg, `Invalid item code (${offerItemCode}).`, 0, 5000);

		// Check if receive item code is default (all) or valid.
		if (!receiveItemCode)
			return MessagesHelper.selfDestruct(msg, `Invalid item code (${receiveItemCode}).`, 0, 5000);

		// If receive item code has been given, make sure only those matching returned.
		const matches = await TradeHelper.findOfferReceiveMatches(offerItemCode, receiveItemCode);
		
		// Return no matching trades warning.
		if (matches.length === 0) {
			const noMatchesStr = `No conversion data/existing trades including ${offerItemCode} for ${receiveItemCode}.`;
			return MessagesHelper.selfDestruct(msg, noMatchesStr, 0, 5000);
		}
		const conversionRate = await TradeHelper.conversionRate(offerItemCode, receiveItemCode);
		return MessagesHelper.selfDestruct(msg, `1 ${offerItemCode} = ${conversionRate}* _(* Based on open trades)_.`, 0, 20000);

    }
    
};