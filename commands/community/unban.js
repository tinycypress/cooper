import CoopCommand from '../../operations/activity/messages/coopCommand';
import { VOTE_AGAINST, VOTE_FOR } from '../../origin/config/rawemojis.json';

import { MESSAGES, REACTIONS, ROLES, SERVER, USERS } from '../../origin/coop';

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
			const userBans = await SERVER._coop().fetchBans();
			const userBan = userBans.find(user => user.id === discordID);
			
			// Show the ban info on the unban reaction collector for consent/safety.
			const banReason = false ? 'Ban reason.' : 'Unknown ban reason.';
			const unbanVoteText = 'Testing.';
			const unbanConsentMsg = await MESSAGES.silentSelfDestruct(msg, unbanVoteText, 0, 60000);
			
			// Add the suggestion reactions for voting.
			await MESSAGES.delayReact(unbanConsentMsg, VOTE_FOR, 333);
			await MESSAGES.delayReact(unbanConsentMsg, VOTE_AGAINST, 666);
			
			// Create a function for updating the consent message during voting.
			const modifierFn = (msg, user, vote) => msg.edit(`
				${msg.content} \n${vote} <@${user.id}>
			`.trim());

			// Wait for reactions indicating democratic consent to unban.
			const voteEmojis = [VOTE_FOR, VOTE_AGAINST];
			const consentResult = await REACTIONS._usersEmojisAwait(unbanConsentMsg, voteEmojis, modifierFn);
			
			// Calculate the result of the multi-member consent/approval vote.
			console.log(consentResult);

			console.log(userBan);
			console.log(banReason);

			// Unban a user by ID (or with a user/guild member object)
			// const unbanResult = await SERVER._coop().members.unban(user.id);
			// 	.then(user => console.log(`Unbanned ${user.username} from ${guild.name}`))
			// 	.catch(console.error);

			return MESSAGES.silentSelfDestruct(msg, `Attempted to unban <#${discordID}>, work in progress.`);

		} catch(e) {
			if (e.message === 'Unknown Ban') {
				return MESSAGES.silentSelfDestruct(msg, 'Could not find that user to unban/ban does not exist.');
			}

			console.log('Democratic unban failed.');
			console.error(e);
		}
    }
    
}


