import CoopCommand from '../../operations/activity/messages/coopCommand';
import { MESSAGES } from '../../origin/coop';

export default class LoginCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'login',
			group: 'website',
			memberName: 'login',
			description: 'Conveniently login to The Coop website',
			examples: ['!login']
		});
	}

	async run(msg) {
		super.run(msg);

		// Generate and save a login code for them.
		MESSAGES.selfDestruct(msg, 'YOUR LOGIN CODE...?');

		// DM the login code to the user

		// Validate on the page the login code link includes.
    }
    
}