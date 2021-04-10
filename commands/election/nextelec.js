import ElectionHelper from '../../operations/members/hierarchy/election/electionHelper';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE, SERVER } from '../../origin/coop';


export default class NextElectionCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'nextelec',
			group: 'election',
			memberName: 'nextelec',
			aliases: [],
			description: 'Check nextelec election date',
			details: ``,
			examples: ['nextelec']
		});
	}

	async run(msg) {
		super.run(msg);

		// Format and send next election/remaining time info.
		const dateFmt = await ElectionHelper.nextElecFmt();
		const humanRemaining = await ElectionHelper.humanRemainingNext();
		const msgText = `Next Election: ${dateFmt}, (${humanRemaining}).`;
		COOP.MESSAGES.selfDestruct(msg, msgText);
    }
    
}