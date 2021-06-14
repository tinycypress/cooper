import ElectionHelper from '../../operations/members/hierarchy/election/electionHelper';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { TIME } from '../../origin/coop';
import { CHANNELS } from '../../origin/config';


export default class VotingTimeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'votingtime',
			group: 'election',
			memberName: 'votingtime',
			aliases: [],
			description: 'Check voting time remaining',
			examples: ['!votingtime']
		});
	}

	async run(msg) {
		super.run(msg);

		const isOn = await ElectionHelper.isElectionOn();
		const chanTag = `<#${CHANNELS.ELECTION.id}>`;

		if (isOn) {
			const votingSecs = await ElectionHelper.votingPeriodLeftSecs();
			const readableRemaining = TIME.humaniseSecs(votingSecs);
			COOP.MESSAGES.selfDestruct(msg, `${chanTag} voting time remaining: ${readableRemaining}.`);

			// TODO: Improve to a more readable/useful output.
			// const msgText = `Next Election: ${dateFmt}, (${humanRemaining}).`;
		} else {
			COOP.MESSAGES.selfDestruct(msg, `${chanTag} is not running.`);
		}

    }
    
}