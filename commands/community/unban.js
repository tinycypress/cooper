import CoopCommand from '../../operations/activity/messages/coopCommand';

import COOP, { SERVER, USERS } from '../../origin/coop';
import { EMOJIS } from '../../origin/config';

export default class UnbanCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'unban',
			group: 'community',
			memberName: 'unban',
			description: 'Attempt to democratically unban a user.',
			details: ``,
			examples: ['unban', 'unban example'],
			args: [
				{
					key: 'user',
					type: 'user',
					prompt: 'Full Discord ID of the person you wish to vote on unbanning? (e.g. shinoa#4124)',

				}
			]
		});
	}

	async run(msg, { user }) {
		super.run(msg);

		try {
			COOP.MESSAGES.selfDestruct(msg, 'You wanna democratically unban, ey?', 0, 20000);


			const unbanArgFilter = m => {
				if (USERS.isCooper) return false;
				// There is a match for the message content of this user.
			}

			// Wait for reactions indicating democratic consent to unban.


			// Prevent usage of unban for another hour.




		} catch(e) {
			console.error(e);
		}
    }
    
}


