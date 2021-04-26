import CoopCommand from '../../operations/activity/messages/coopCommand';

import COOP, { MESSAGES, REACTIONS, ROLES, SERVER, USERS } from '../../origin/coop';
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
					key: 'discordID',
					type: 'string',
					prompt: 'Full Discord ID of the person you wish to vote on unbanning? (e.g. shinoa#4124)',

				}
			]
		});
	}

	async run(msg, { discordID }) {
		super.run(msg);

		try {
			
			// Prevent usage of unban for another hour.
			const userBan = await SERVER._coop().fetchBan(discordID);
			
			const banReason = false ? 'Ban reason.' : 'Unknown ban reason.';

			console.log(userBan);

			console.log(banReason);
			
			// Wait for reactions indicating democratic consent to unban.
			const unbanVoteText = 'Testing.';

			// Show the ban info on the unban reaction collector for consent/safety.
			const unbanConsentMsg = await MESSAGES.selfDestruct(msg, unbanVoteText, 0, 30000);

			// Add the suggestion reactions for voting.
			MESSAGES.delayReact(unbanConsentMsg, EMOJIS.VOTE_FOR, 333);
			MESSAGES.delayReact(unbanConsentMsg, EMOJIS.VOTE_AGAINST, 666);

			// Use the approval emojis
			const consentResult = await unbanConsentMsg.awaitReactions((reaction, user) => {
				// Make sure user has MEMBER role.
				const isMember = ROLES._idHasCode(user.id, 'MEMBER');
				const isValidEmoji = [EMOJIS.VOTE_FOR, EMOJIS.VOTE_AGAINST].includes(reaction.emoji.name);
				const isCooper = USERS.isCooper(user.id);
				return isValidEmoji && !isCooper && isMember;
			}, { max: 1, time: 30000, errors: ['time'] });


			console.log(consentResult);

			// Unban a user by ID (or with a user/guild member object)
			// const unbanResult = await SERVER._coop().members.unban(user.id);
			// 	.then(user => console.log(`Unbanned ${user.username} from ${guild.name}`))
			// 	.catch(console.error);

		} catch(e) {
			if (e.message === 'Unknown Ban') {
				return MESSAGES.silentSelfDestruct(msg, 'Could not find that user to unban/ban does not exist.');
			}

			console.log('Democratic unban failed.');
			console.error(e);
		}
    }
    
}


