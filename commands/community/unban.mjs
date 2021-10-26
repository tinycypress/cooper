import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import VotingHelper from '../../operations/activity/redemption/votingHelper.mjs';
import { SACRIFICE_RATIO_PERC } from '../../operations/members/redemption/sacrificeHelper.mjs';
import { VOTE_FOR } from '../../origin/config/rawemojis.json';

import { MESSAGES, REACTIONS, SERVER } from '../../origin/coop.mjs';

export default class UnbanCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'unban',
			group: 'community',
			memberName: 'unban',
			description: 'Attempt to democratically unban a user.',
			examples: ['!unban <user>', '!unban shinoa#4124'],
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
			const userBanData = userBans.find(ban => ban.user.id === discordID);
			if (!userBanData) return MESSAGES.silentSelfDestruct(msg, 'Could not find that user to unban/ban does not exist.');

			// Output a consent awaiting message attempting to unban the user
			const banReason = userBanData.reason ? userBanData.reason : 'Unknown ban reason.';
			const unbanVoteText = `**Vote on unbanning <@${discordID}>, ban reason:**\n\n`
				+ `${banReason}\n\n_Press ${VOTE_FOR} to vote unban._`;
			const unbanConsentMsg = await MESSAGES.silentSelfDestruct(msg, unbanVoteText, 0, 60000);
			await MESSAGES.delayReact(unbanConsentMsg, VOTE_FOR, 333);
			
			// Create a function for updating the consent message during voting.
			const modifierFn = (msg, { id }, vote) => msg.edit(`${msg.content} \n${vote} <@${id}>`);

			// Calculate the result of the multi-member consent/approval vote.
			const consentResult = await REACTIONS._usersEmojisAwait(unbanConsentMsg, [VOTE_FOR], modifierFn);			
			const unbanVotesReq = VotingHelper.getNumRequired(SACRIFICE_RATIO_PERC);
			const forCount = REACTIONS.countTypeCollection(consentResult, VOTE_FOR) - 1;
			const votesSufficient = forCount >= unbanVotesReq;

			// Unban a user by ID (or with a user/guild member object)
			if (votesSufficient) await SERVER._coop().members.unban(discordID);

			// Form the result text and output.
			const resultText = `Unban vote ${votesSufficient ? 'successful' : 'failed'} ` +
				`${forCount}/${unbanVotesReq} ${VOTE_FOR}.`;
			return MESSAGES.selfDestruct(msg, resultText, 0, 20000);

		} catch(e) {
			console.log('Democratic unban failed.');
			console.error(e);
		}
    }
    
}


