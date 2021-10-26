import ElectionHelper from '../../operations/members/hierarchy/election/electionHelper.mjs';

import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import COOP from '../../origin/coop.mjs';


export default class LastElectionCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'lastelec',
			group: 'election',
			memberName: 'lastelec',
			aliases: [],
			description: 'Check the date of the last election. To see the date of the next election, use !nextelec',
			examples: ['!lastelec']
		});
	}

	async run(msg) {
		super.run(msg);

		// TODO: If election is currently on, then it is recalculated to the one before that.

		const isOn = await ElectionHelper.isVotingPeriod();

		if (isOn) {
			COOP.MESSAGES.selfDestruct(msg, 'Election is on now, recalculate one previous.');
		} else {
			const dateFmt = await ElectionHelper.lastElecFmt();
			const msgText = `Last Election: ${dateFmt}`;
			COOP.MESSAGES.selfDestruct(msg, msgText);
		}

    }
    
}