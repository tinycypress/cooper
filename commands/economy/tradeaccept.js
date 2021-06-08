import TradingHelper from '../../operations/minigames/medium/economy/items/tradingHelper';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';


export default class TradeAcceptCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'tradeaccept',
			group: 'economy',
			memberName: 'tradeaccept',
			aliases: [],
			description: 'Lets you accept an open trade. Use !tradefind to view current open trades.',
			examples: ['!tradeaccept <tradeID>', '!tradeaccept 173'],
			args: [
				{
					key: 'tradeID',
					prompt: 'Accept which trade #ID?',
					type: 'string'
				},
			],
		});
	}

	async run(msg, { tradeID }) {
		super.run(msg);

		// Sanitise + validate input a little before processing.
		tradeID = parseInt(tradeID.trim().replace('#', ''));

		try {
			const tradeeID = msg.author.id;
			const tradeeName = msg.author.username;

			// Check if valid trade ID given.
			const trade = await TradingHelper.get(tradeID);
			if (!trade) return COOP.MESSAGES.selfDestruct(msg, `Invalid trade ID - already sold?`, 0, 5000);
			
			// Check if user can fulfil the trade.
			const hasEnough = await COOP.ITEMS.hasQty(tradeeID, trade.receive_item, trade.receive_qty);
			if (!hasEnough) return COOP.MESSAGES.selfDestruct(msg, `Insufficient offer quantity for trade.`, 0, 5000);

			// Let helper handle accepting logic as it's used in multiple places so far.
			const tradeAccepted = await TradingHelper.accept(tradeID, tradeeID, tradeeName);
			if (tradeAccepted) {
				COOP.MESSAGES.selfDestruct(msg, 'Trade accepted.', 0, 10000);
			} else {
				// Log cancelled trades
				COOP.MESSAGES.selfDestruct(msg, 'Trade could not be accepted.', 0, 5000);
				console.log('Trade accept failed');
			}
			
		} catch(e) {
			console.log('Failed to trade item.');
			console.error(e);
		}
    }
    
}
