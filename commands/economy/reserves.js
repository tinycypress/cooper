import ReservesHelper from '../../operations/minigames/medium/economy/reservesHelper';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE, SERVER } from '../../origin/coop';


export default class ReservesCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'reserves',
			group: 'economy',
			memberName: 'reserves',
			aliases: ['res'],
			description: 'This command lets you reserves the items you own',
			details: `Details of the reserves command`,
			examples: ['reserves', '!reserves laxative']
		});
	}

	async run(msg) {
		super.run(msg);

		// TODO: This should be updated in an economy channel somewhere.
		// TODO: Notify community with over 10% change to reserves.
		COOP.MESSAGESselfDestruct(
			msg, 
			`**Economy Reserves:**\n${await ReservesHelper.balanceText()}`
		);
    }
    
};