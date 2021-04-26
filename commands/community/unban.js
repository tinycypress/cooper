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

			// Wait for reactions indicating democratic consent to unban.

			// Prevent usage of unban for another hour.
			// Returns: Promise<BanInfo>
			// const userBan = await SERVER._coop().fetchBan(user.id);
			// console.log(userBan);

			// Show the ban info on the unban reaction collector for consent/safety.

			// Unban a user by ID (or with a user/guild member object)
			// guild.members.unban('84484653687267328')
			// 	.then(user => console.log(`Unbanned ${user.username} from ${guild.name}`))
			// 	.catch(console.error);



		} catch(e) {
			console.error(e);
		}
    }
    
}


