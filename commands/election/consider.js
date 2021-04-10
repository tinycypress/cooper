import ElectionHelper from '../../operations/members/hierarchy/election/electionHelper';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE, SERVER } from '../../origin/coop';


export default class ConsiderCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'consider',
			group: 'election',
			memberName: 'consider',
			aliases: ['celec'],
			description: 'Consider an electoral candate, shows their campaign message and platform.',
			details: ``,
			examples: ['consider', '!consider {OPTIONAL:?@user OR "username"?}'],
			// args: [
			// 	{
			// 		key: 'candidate',
			// 		prompt: 'Indicate the user/candidate you want to check',
			// 		type: 'user',
			// 		default: null
			// 	},
			// ],
		});
	}

	// async run(msg, { candidate }) {
	async run(msg) {
		super.run(msg);

		// Check if election is ongoing.
		const isElec = await ElectionHelper.isElectionOn();

		if (!isElec) {
			const nextElecFmt = await ElectionHelper.nextElecFmt();
			const noElecText = `There is no election currently ongoing. !nextelec: ${nextElecFmt}`;
			return COOP.MESSAGES.selfDestruct(msg, noElecText, 0, 5000);
		}

		// Otherwise show the list in a self-destruct msg.
		const candidates = await ElectionHelper.getAllCandidates();

		const resultsText = candidates.map(u => `${u.candidate_id}: ?}`).join('\n');
		COOP.MESSAGES.selfDestruct(msg, resultsText);

		// if (candidate) {
		// 	// Retrieve the campaign message of candidate
		// 	console.log('should try to access candidate');
		// 	COOP.MESSAGES.selfDestruct(msg, 'You wanna know bout dis here candidate?');

		// } else {
		// }	
    }
    
}