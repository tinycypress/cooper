import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import TradeHelper from '../../community/features/economy/tradeHelper';
import UsersHelper from '../../core/entities/users/usersHelper';


export default class TradeAcceptCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'tradeaccept',
			group: 'economy',
			memberName: 'tradeaccept',
			aliases: [],
			description: 'This command lets you tradeaccept the items you own',
			details: `Details of the tradeaccept command`,
			examples: ['tradeaccept', '!tradeaccept LAXATIVE AVERAGE_EGG 1 5'],
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
			const trade = await TradeHelper.get(tradeID);
			if (!trade) return MessagesHelper.selfDestruct(msg, `Invalid trade ID - already sold?`, 0, 5000);
			
			// Check if user can fulfil the trade.
			const hasEnough = await ItemsHelper.hasQty(tradeeID, trade.receive_item, trade.receive_qty);
			if (!hasEnough) return MessagesHelper.selfDestruct(msg, `Insufficient offer quantity for trade.`, 0, 5000);

			// Let helper handle accepting logic as it's used in multiple places so far.
			const tradeAccepted = await TradeHelper.accept(tradeID, tradeeID, tradeeName);
			if (tradeAccepted) {
				MessagesHelper.selfDestruct(msg, 'Trade accepted.', 0, 10000);
			} else {
				// Log cancelled trades
				MessagesHelper.selfDestruct(msg, 'Trade could not be accepted.', 0, 5000);
				console.log('Trade accept failed');
			}
			
		} catch(e) {
			console.log('Failed to trade item.');
			console.error(e);
		}
    }
    
};
