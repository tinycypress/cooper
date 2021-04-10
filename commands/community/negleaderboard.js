import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { SERVER, STATE } from '../../origin/coop';

export default class NegativeLeaderboardCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'negleaderboard',
			group: 'community',
			memberName: 'negleaderboard',
			aliases: ['ngl'],
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
			// negleaderboard position can either be:
			// None: show top 15
			// User: show user position and 5 either side
			// Number: show rank number and 5 either side
			const leaderboardRows = await COOP.POINTS.getNegLeaderboard(position);
			const placeholderMsg = await msg.say('Calculating leaderboard, please wait.');

			const guild = SERVER.getByCode(STATE.CLIENT, 'PROD');
			
			// Form leaderboard text
			const rowUsers = await Promise.all(leaderboardRows.map(async (row, index) => {
				let username = '?';
				try {
					const member = await guild.members.fetch(row.owner_id);
					username = member.user.username;

				} catch(e) {
					console.log('Error loading user via ID');
					console.error(e);
				}
				return {
					username,
					rank: index + position,
					pointsQty: row.quantity
				}
			}));

			let leaderboardMsgText = '```\n\n ~ NEGATIVE LEADERBOARD ~ \n\n' + 
				rowUsers.map(user => `${user.rank + 1}. ${user.username} ${user.pointsQty}`).join('\n') +
				'```';

			await placeholderMsg.edit(leaderboardMsgText)

		} catch(e) {
			console.error(e);
		}
    }
    
};