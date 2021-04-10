import CoopCommand from '../../operations/activity/messages/coopCommand';
import ReservesHelper from '../../operations/minigames/medium/economy/reservesHelper';

export default class ReserveAddressCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'reserveaddress',
			group: 'economy',
			memberName: 'reserveaddress',
			aliases: ['resadd', 'resaddr'],
			description: 'This command lets you reserveaddress the items you own',
			details: `Details of the reserveaddress command`,
			examples: ['reserveaddress', '!reserveaddress laxative']
		});
	}

	async run(msg) {
		super.run(msg);

		// State addresses for reserve wallets.
        const address = await ReservesHelper.address();

		// Use say here instead of leave, so there's a record/advertisemnt. :D
		msg.say(`**Reserves' Wallet Address:**\n${address}`);

		// COOP.MESSAGES.selfDestruct(msg, );
    }
    
};