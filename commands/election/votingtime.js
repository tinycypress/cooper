import CoopCommand from '../../core/entities/coopCommand';

import CHANNELS from '../../core/config/channels.json';

import ElectionHelper from '../../community/features/hierarchy/election/electionHelper';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import TimeHelper from '../../community/features/server/timeHelper';


export default class VotingTimeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'votingtime',
			group: 'election',
			memberName: 'votingtime',
			aliases: [],
			description: 'Check voting time remaining',
			details: ``,
			examples: ['votingtime']
		});
	}

	async run(msg) {
		super.run(msg);

		const isOn = await ElectionHelper.isElectionOn();
		const chanTag = `<#${CHANNELS.ELECTION.id}>`;

		if (isOn) {
			const votingSecs = await ElectionHelper.votingPeriodLeftSecs();
			const readableRemaining = TimeHelper.humaniseSecs(votingSecs);
			MessagesHelper.selfDestruct(msg, `${chanTag} voting time remaining: ${readableRemaining}.`);

			// TODO: Improve to a more readable/useful output.
			// const msgText = `Next Election: ${dateFmt}, (${humanRemaining}).`;
		} else {
			MessagesHelper.selfDestruct(msg, `${chanTag} is not running.`);
		}

    }
    
};