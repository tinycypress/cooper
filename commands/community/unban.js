import CoopCommand from '../../operations/activity/messages/coopCommand';
import VotingHelper from '../../operations/activity/redemption/votingHelper';
import { SACRIFICE_RATIO_PERC } from '../../operations/members/redemption/sacrificeHelper';
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
			
			// Show the ban info on the unban reaction collector for consent/safety.
			// Add the suggestion reactions for voting.
			const userBan = userBans.find(user => user.id === discordID);
			const banReason = userBan ? 'Ban reason.' : 'Unknown ban reason.';
			const unbanVoteText = `Vote on unbanning <@${discordID}>, press ${VOTE_FOR} to vote unban.`;
			const unbanConsentMsg = await MESSAGES.silentSelfDestruct(msg, unbanVoteText, 0, 60000);
			await MESSAGES.delayReact(unbanConsentMsg, VOTE_FOR, 333);
			
			// Create a function for updating the consent message during voting.
			const modifierFn = (msg, { id }, vote) => msg.edit(`${msg.content} \n${vote} <@${id}>`);
			// Calculate the result of the multi-member consent/approval vote.
			const consentResult = await REACTIONS._usersEmojisAwait(unbanConsentMsg, [VOTE_FOR], modifierFn);			
			const unbanVotesReq = VotingHelper.getNumRequired(SACRIFICE_RATIO_PERC);
			const forCount = REACTIONS.countType(consentResult, VOTE_FOR - 1);
			const votesSufficient = forCount >= unbanVotesReq;

			console.log(userBan);
			console.log(consentResult);
			console.log(forCount);
			console.log(votesSufficient);

			// Form the result text and output.
			let resultText = `Unban vote ${votesSufficient ? 'successful' : 'failed'} ` +
				`${forCount}/${unbanVotesReq} ${VOTE_FOR}. (WORK IN PROGRESS)`;

			// Unban a user by ID (or with a user/guild member object)
			// const unbanResult = await SERVER._coop().members.unban(user.id);
			// 	.then(user => console.log(`Unbanned ${user.username} from ${guild.name}`))
			// 	.catch(console.error);

			return MESSAGES.selfDestruct(msg, resultText, 0, 20000);

		} catch(e) {
			if (e.message === 'Unknown Ban') {
				return MESSAGES.silentSelfDestruct(msg, 'Could not find that user to unban/ban does not exist.');
			}

			console.log('Democratic unban failed.');
			console.error(e);
		}
    }
    
}


