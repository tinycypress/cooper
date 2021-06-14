import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { SERVER, STATE } from '../../origin/coop';

export default class NegativeLeaderboardCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'negleaderboard',
			group: 'community',
			memberName: 'negleaderboard',
			aliases: ['ngl'],
			description: 'Shows bottom 15 on points leaderboard. Optional argument can specify the starting rank. To show top leaderboard, see !leaderboard',
			examples: ['!negleaderboard <rank>', '!negleaderboard', '!negleaderboard 20'],
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
    
}