import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';



export default class LeaderboardCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'leaderboard',
			group: 'community',
			memberName: 'leaderboard',
			aliases: ['lb', 'top'],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `Details of the points command`,
			examples: ['points', 'an example of how coop-economics functions, trickle down, sunny side up Egg & Reaganonmics. Supply and demand.'],
			args: [
				{
					key: 'position',
					prompt: 'What rank position to look around?',
					type: 'integer',
					default: 0
				},
			],
		});
	}

	async run(msg, { position }) {
		super.run(msg);

		try {
			// Leaderboard position can either be:
			// None: show top 15
			// User: show user position and 5 either side
			// Number: show rank number and 5 either side
			const leaderboardRows = await COOP.POINTS.getLeaderboard(position);
			const placeholderMsg = await COOP.MESSAGES.selfDestruct(msg, 'Calculating leaderboard, please wait.', 0, 60000);

			// Edit the content into the message.
			const leaderboardMsgText = await COOP.POINTS.renderLeaderboard(leaderboardRows, position);
			COOP.MESSAGES.delayEdit(placeholderMsg, leaderboardMsgText, 2000);

		} catch(e) {
			console.error(e);
		}
    }
    
}