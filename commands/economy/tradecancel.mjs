import TradingHelper from '../../operations/minigames/medium/economy/items/tradingHelper.mjs';

import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import COOP from '../../origin/coop.mjs';


export default class TradeCancelCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'tradecancel',
			group: 'economy',
			memberName: 'tradecancel',
			aliases: [],
			description: 'Cancel one of your open trades. Use !trades to view your open trades.',
			examples: ['!tradecancel <tradeID>', '!tradecancel 73'],
			args: [
				{
					key: 'tradeID',
					prompt: 'Cancel which trade #ID?',
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
			// More readable access to useful properties.
			const tradeeID = msg.author.id;
			const tradeeName = msg.author.username;

			// Check if valid trade ID given.
			const trade = await TradingHelper.get(tradeID);
			if (!trade) return COOP.MESSAGES.selfDestruct(msg, `Invalid # trade ID - already cancelled?`, 0, 5000);
			
			// Check if user can fulfil the trade.
			const isYours = trade.trader_id === tradeeID;
			if (!isYours) return COOP.MESSAGES.selfDestruct(msg, `Trade #${trade.id} is not yours to cancel.`, 0, 5000);

			// Let helper handle accepting logic as it's used in multiple places so far.
			const tradeCancelled = await TradingHelper.cancel(tradeID, tradeeID, tradeeName);
			if (tradeCancelled) {
				// Log cancelled trades
				COOP.MESSAGES.selfDestruct(msg, `Trade #${trade.id} cancelled.`, 0, 7500);
			} else {
				COOP.MESSAGES.selfDestruct(msg, `Trade #${trade.id} could not be cancelled.`, 0, 10000);
				console.log('Trade cancel failed');
			}
			
		} catch(e) {
			console.log('Failed to cancel trade.');
			console.error(e);
		}
    }
    
}
