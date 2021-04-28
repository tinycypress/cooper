import CoopCommand from '../../operations/activity/messages/coopCommand';
import VotingHelper from '../../operations/activity/redemption/votingHelper';
import SacrificeHelper, { SACRIFICE_RATIO_PERC } from '../../operations/members/redemption/sacrificeHelper';
import { DAGGER } from '../../origin/config/emojis.json';

import { CHANNELS, MESSAGES, REACTIONS, ROLES } from '../../origin/coop';

export default class SacrificeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'sacrifice',
			group: 'community',
			memberName: 'sacrifice',
			description: 'Attempt to democratically sacrifice a user.',
			details: ``,
			examples: ['sacrifice', 'sacrifice example'],
			args: [
				{
					key: 'target',
					type: 'user',
					prompt: 'Type or mention the user you wish to democratically offer for sacrifice.'
				}
			]
		});
	}

	async run(msg, { target }) {
		super.run(msg);

		try {
			if (!target) {
				const invalidText = 'Could not find that beak for you.';
				return MESSAGES.silentSelfDestruct(msg, invalidText);
			}

			// If the user of the command is leader/commander - instant sacrifice.
			const instantSacrificers = ROLES._getUsersWithRoleCodes(['LEADER', 'COMMANDER']);
			const hasInstantPower = instantSacrificers.some(isU => isU.id === msg.author.id);
			if (hasInstantPower) {
				// Output a consent awaiting message attempting to unban the user
				const sacrificeText = `**<@${msg.author.id}> used their instant sacrifice power to offer <@${target.id}> for ${CHANNELS.textRef('SACRIFICE')}.`;
				return MESSAGES.silentSelfDestruct(msg, sacrificeText, 0, 60000);
			}
			
			// Output a consent awaiting message attempting to unban the user
			const sacrificeText = `**Vote on offering <@${target.id}> for ${CHANNELS.textRef('SACRIFICE')}:**\n\n` +
				`_Press ${DAGGER} to vote to offer :dagger:._`;
			const sacrificeConsentMsg = await MESSAGES.silentSelfDestruct(msg, sacrificeText, 0, 60000);
			await MESSAGES.delayReact(sacrificeConsentMsg, DAGGER, 333);
			
			// Create a function for updating the consent message during voting.
			const modifierFn = (msg, { id }, vote) => msg.edit(`${msg.content} \n${vote} <@${id}>`);

			// Calculate the result of the multi-member consent/approval vote.
			const consentResult = await REACTIONS._usersEmojisAwait(sacrificeConsentMsg, [DAGGER], modifierFn);			
			const unbanVotesReq = VotingHelper.getNumRequired(SACRIFICE_RATIO_PERC);
			const forCount = REACTIONS.countTypeCollection(consentResult, DAGGER) - 1;
			const votesSufficient = forCount >= unbanVotesReq;

			// Unban a user by ID (or with a user/guild member object)
			if (votesSufficient) await SacrificeHelper.offer(target);

			// Form the result text and output.
			const resultText = `${CHANNELS.textRef('SACRIFICE')} vote ${votesSufficient ? 'successful' : 'failed'} ` +
				`${forCount}/${unbanVotesReq} ${DAGGER}.`;
			return MESSAGES.selfDestruct(msg, resultText, 0, 20000);

		} catch(e) {
			console.log('Democratic sacrifice failed.');
			console.error(e);
		}
    }
    
}


