import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import TradeHelper from '../../community/features/economy/tradeHelper';

export default class TradesCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'trades',
			group: 'economy',
			memberName: 'trades',
			aliases: ['mytr'],
			description: 'This command lets you check your ongoing trades',
			details: `Details of the trades command`,
			examples: ['trades', '!trades LAXATIVE'],
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
			const myTrades = await TradeHelper.getByTrader(msg.author.id);
			
			// Interpret item codes from strings or emojis.
			const offerItemCode = ItemsHelper.interpretItemCodeArg(offerItemCodeStr);
			const receiveItemCode = ItemsHelper.interpretItemCodeArg(receiveItemCodeStr);
	
			// Check if offer item code is default (all) or valid.
			if (offerItemCodeStr !== '' && !offerItemCode)
				return MessagesHelper.selfDestruct(msg, `Invalid offer item code (${offerItemCodeStr}).`, 0, 7500);
	
			// Check if receive item code is default (all) or valid.
			if (receiveItemCodeStr !== '' && !receiveItemCode)
				return MessagesHelper.selfDestruct(msg, `Invalid receive item code (${receiveItemCodeStr}).`, 0, 7500);

			// Calculate used/total trade slots.
			// TODO: Implement trade slots as a separate command.
			const tradeslotStr = `${msg.author.username} has ${myTrades.length}/5 active trades slots.\n\n`;

			// User did not specify a preference, show default response.
			if (offerItemCodeStr === '') {
				// Display all trades
				const allTradesStr = TradeHelper.manyTradeItemsStr(myTrades);
				const allTitleStr = `**All ${msg.author.username}'s trades:**\n\n`;
				return MessagesHelper.selfDestruct(msg, allTitleStr + tradeslotStr + allTradesStr);
		
				// Do this and then prevent eggs from removing themselves under that condition....

			// User attempted to provide offer item code, find only trades with that offer item.
			} else if (offerItemCodeStr !== '' && receiveItemCodeStr === '') {
				// Get trades based on a match.
				const matchingOffered = myTrades.filter(trade => trade.offer_item === offerItemCode);
				const matchingTitleStr = `**Trades requiring your ${offerItemCode}:**\n\n`;
				const matchingTradesStr = TradeHelper.manyTradeItemsStr(matchingOffered);
				return MessagesHelper.selfDestruct(msg, matchingTitleStr + matchingTradesStr);				
			
			// User attempted to provide both item codes, find only matches.
			} else if (offerItemCodeStr !== '' && receiveItemCodeStr !== '') {
				// Get trades based on a match.
				const matchingOfferedReceived = myTrades.filter(trade => 
					trade.offer_item === offerItemCode && trade.receive_item === receiveItemCode
				);
				const matchesTitleStr = `**Trades exchanging ${offerItemCode} for ${receiveItemCode}:**\n\n`;
				const matchingOfferedReceivedStr = TradeHelper.manyTradeItemsStr(matchingOfferedReceived);
				return MessagesHelper.selfDestruct(msg, matchesTitleStr + matchingOfferedReceivedStr);
			}
			
		} catch(e) {
			console.log('Failed to retrieve user\'s mytrades.');
			console.error(e);
		}
    }
    
};
