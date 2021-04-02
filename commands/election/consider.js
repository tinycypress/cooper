import ElectionHelper from '../../community/features/hierarchy/election/electionHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';


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
			return MessagesHelper.selfDestruct(msg, noElecText, 0, 5000);
		}

		// Otherwise show the list in a self-destruct msg.
		const candidates = await ElectionHelper.getAllCandidates();
		const VotesCounts = await ElectionHelper.countVotes();

		const resultsText = candidates.map(u => `${u.candidate_id}:${VotesCounts[u.candidate_id]}`).join('\n');
		MessagesHelper.selfDestruct(msg, resultsText);

		// if (candidate) {
		// 	// Retrieve the campaign message of candidate
		// 	console.log('should try to access candidate');
		// 	MessagesHelper.selfDestruct(msg, 'You wanna know bout dis here candidate?');

		// } else {
		// }	
    }
    
};