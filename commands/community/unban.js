import CoopCommand from '../../operations/activity/messages/coopCommand';

import COOP, { SERVER } from '../../origin/coop';
import { EMOJIS } from '../../origin/config';

export default class UnbanCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'unban',
			group: 'community',
			memberName: 'unban',
			description: 'Attempt to democratically unban a user.',
			details: ``,
			examples: ['unban', 'unban example']
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			COOP.MESSAGES.selfDestruct(msg, 'You wanna democratically unban, ey?', 0, 20000);

		} catch(e) {
			console.error(e);
		}
    }
    
}


