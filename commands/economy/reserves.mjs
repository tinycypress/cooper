import ReservesHelper from '../../operations/minigames/medium/economy/reservesHelper.mjs';

import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import COOP from '../../origin/coop.mjs';


export default class ReservesCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'reserves',
			group: 'economy',
			memberName: 'reserves',
			aliases: ['res', 'balance'],
			description: 'This command lets you deficit the items you own',
			details: `Details of the deficit command`,
			examples: ['reserves', '!reserves laxative']
		});
	}

	async run(msg) {
		super.run(msg);

		// Get the FIAT, BTC, DOGE, LTC balances and combine:

		// TODO: This should be updated in an economy channel somewhere.
		// TODO: Notify community with over 10% change to reserves.
		COOP.MESSAGES.selfDestruct(
			msg, 
			`**Economy Reserves:**\n${await ReservesHelper.balanceText()}` +
			`// TODO: Get the FIAT, BTC, DOGE, LTC balances and combine...`
		);
    }
    
}