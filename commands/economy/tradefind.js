import TradingHelper from '../../operations/minigames/medium/economy/items/tradingHelper';
import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE, SERVER } from '../../origin/coop';

export default class TradeFindCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'tradefind',
			group: 'economy',
			memberName: 'tradefind',
			aliases: ['findtr'],
			description: 'This command lets you find the trades you want',
			details: `Details of the tradefind command`,
			examples: ['tradefind', '!tradefind laxative'],
			args: [
				{
					key: 'offerItemCodeStr',
					prompt: 'Which item_code are you offering?',
					type: 'string',
					default: ''
				},
				{
					key: 'receiveItemCodeStr',
					prompt: 'Which item_code should you receive?',
					type: 'string',
					default: ''
				}
			],
		});
	}

	async run(msg, { offerItemCodeStr, receiveItemCodeStr }) {
		super.run(msg);

		const offerItemCode = COOP.ITEMS.interpretItemCodeArg(offerItemCodeStr);
		const receiveItemCode = COOP.ITEMS.interpretItemCodeArg(receiveItemCodeStr);

		// Check if offer item code is default (all) or valid.
		if (offerItemCodeStr !== '' && !offerItemCode)
			return COOP.MESSAGESselfDestruct(msg, `Invalid offer item code (${offerItemCodeStr}).`, 0, 5000);

		// Check if receive item code is default (all) or valid.
		if (receiveItemCodeStr !== '' && !receiveItemCode)
			return COOP.MESSAGESselfDestruct(msg, `Invalid receive item code (${receiveItemCodeStr}).`, 0, 5000);

		// Check for index request/all/latest.
		if (offerItemCodeStr === '') {
			// Return a list of 15 latest trades.
			const all = await TradingHelper.all();
			
			// Add feedback for no trades currently.
			if (all.length === 0) {
				const noMatchesStr = `No existing trades listed/open.`;
				return COOP.MESSAGESselfDestruct(msg, noMatchesStr, 0, 7500);
			}
			
			// Give feedback about trade listings.

			// TODO: Provide more tips about !tradeaccept
			const allTitleStr = `**Latest ${all.length} trade listings:**\n\n`;
			return COOP.MESSAGESselfDestruct(msg, allTitleStr + TradingHelper.manyTradeItemsStr(all));

		} else if (offerItemCodeStr !== '' && receiveItemCodeStr !== '') {
			// If receive item code has been given, make sure only those matching returned.
			const matches = await TradingHelper.findOfferReceiveMatches(offerItemCode, receiveItemCode);
			
			// Return no matching trades warning.
			if (matches.length === 0) {
				const noMatchesStr = `No existing trades exchanging ${offerItemCode} for ${receiveItemCode}`;
				return COOP.MESSAGESselfDestruct(msg, noMatchesStr, 0, 7500);

			// Return matching trades.
			} else {
				// Format and present the matches if they exist.
				const matchesTitleStr = `**Trades exchanging ${offerItemCode} for ${receiveItemCode}:**\n\n`;
				const matchesStr = TradingHelper.manyTradeItemsStr(matches);
				return COOP.MESSAGESselfDestruct(msg, matchesTitleStr + matchesStr);
			}

		} else if (offerItemCodeStr !== '' && receiveItemCodeStr === '') {
			// If only offer item given, list all of that type.
			const types = await TradingHelper.findReceiveMatches(offerItemCode);

			// Return no matching trades types warning.
			if (types.length === 0) {
				const noTypesStr = `No existing trades offering ${offerItemCode}`
				return COOP.MESSAGESselfDestruct(msg, noTypesStr, 0, 5000);

			// Return matching trades.
			} else {
				// Format and present the matches if they exist.
				const typesTitleStr = `**Trades requiring your ${offerItemCode}:**\n\n`;
				const typesStr = TradingHelper.manyTradeItemsStr(types);
				return COOP.MESSAGESselfDestruct(msg, typesTitleStr + typesStr);
			}
		}

    }
    
};