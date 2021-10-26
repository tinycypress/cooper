import TradingHelper from '../../operations/minigames/medium/economy/items/tradingHelper.mjs';
import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import COOP from '../../origin/coop.mjs';

export default class TradesCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'trades',
			group: 'economy',
			memberName: 'trades',
			aliases: ['mytr'],
			description: 'Displays your open trades for a specific item. If no item is entered, it displays all your trades.',
			examples: ['!trades <item>', '!trades', '!trades laxative'],
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

		try {
			// Load trades for that user.
			const myTrades = await TradingHelper.getByTrader(msg.author.id);
			
			// Interpret item codes from strings or emojis.
			const offerItemCode = COOP.ITEMS.interpretItemCodeArg(offerItemCodeStr);
			const receiveItemCode = COOP.ITEMS.interpretItemCodeArg(receiveItemCodeStr);
	
			// Check if offer item code is default (all) or valid.
			if (offerItemCodeStr !== '' && !offerItemCode)
				return COOP.MESSAGES.selfDestruct(msg, `Invalid offer item code (${offerItemCodeStr}).`, 0, 7500);
	
			// Check if receive item code is default (all) or valid.
			if (receiveItemCodeStr !== '' && !receiveItemCode)
				return COOP.MESSAGES.selfDestruct(msg, `Invalid receive item code (${receiveItemCodeStr}).`, 0, 7500);

			// Calculate used/total trade slots.
			// TODO: Implement trade slots as a separate command.
			const tradeslotStr = `${msg.author.username} has ${myTrades.length}/5 active trades slots.\n\n`;

			// User did not specify a preference, show default response.
			if (offerItemCodeStr === '') {
				// Display all trades
				const allTradesStr = TradingHelper.manyTradeItemsStr(myTrades);
				const allTitleStr = `**All ${msg.author.username}'s trades:**\n\n`;
				return COOP.MESSAGES.selfDestruct(msg, allTitleStr + tradeslotStr + allTradesStr);
		
				// Do this and then prevent eggs from removing themselves under that condition....

			// User attempted to provide offer item code, find only trades with that offer item.
			} else if (offerItemCodeStr !== '' && receiveItemCodeStr === '') {
				// Get trades based on a match.
				const matchingOffered = myTrades.filter(trade => trade.offer_item === offerItemCode);
				const matchingTitleStr = `**Trades requiring your ${offerItemCode}:**\n\n`;
				const matchingTradesStr = TradingHelper.manyTradeItemsStr(matchingOffered);
				return COOP.MESSAGES.selfDestruct(msg, matchingTitleStr + matchingTradesStr);				
			
			// User attempted to provide both item codes, find only matches.
			} else if (offerItemCodeStr !== '' && receiveItemCodeStr !== '') {
				// Get trades based on a match.
				const matchingOfferedReceived = myTrades.filter(trade => 
					trade.offer_item === offerItemCode && trade.receive_item === receiveItemCode
				);
				const matchesTitleStr = `**Trades exchanging ${offerItemCode} for ${receiveItemCode}:**\n\n`;
				const matchingOfferedReceivedStr = TradingHelper.manyTradeItemsStr(matchingOfferedReceived);
				return COOP.MESSAGES.selfDestruct(msg, matchesTitleStr + matchingOfferedReceivedStr);
			}
			
		} catch(e) {
			console.log('Failed to retrieve user\'s mytrades.');
			console.error(e);
		}
    }
    
}
