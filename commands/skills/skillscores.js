import PointsHelper from '../../community/features/points/pointsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';


export default class SkillScoresCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'skillscores',
			group: 'community',
			memberName: 'skillscores',
			aliases: ['ss', 'skillscore'],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `skillscores details`,
			examples: ['!skillscores crafting'],
			args: [
				{
					key: 'skill',
					prompt: 'Which skill do you want to check?',
					type: 'string',
					default: 'ALL'
				},
				{
					key: 'position',
					prompt: 'What rank position to look around?',
					type: 'integer',
					default: 0
				},
			],
		});
	}

	async run(msg, { skill, position }) {
		super.run(msg);

		try {
			let leaderboardText = 'Leaderboard text';

			// TODO: Check most xp and give skill-score role

			// If ALL skills, return total/top breakdown based on total.
			if (skill === 'ALL') {
				leaderboardText = 'I should return you TOTAL XP leaderboard';

			// Return a specific skill leaderboard if valid.
			} else {
				leaderboardText = `I should return you ${skill} XP leaderboard`;
			}

			// Give a placeholder whilst they're waiting.
			const placeholderMsg = await MessagesHelper.selfDestruct(msg, leaderboardText, 60000);

			// Generate the leaderboard text and update the message.
			MessagesHelper.delayEdit(placeholderMsg, 'But... I can\'t.', 5000);








			// Skillscores position can either be:
			// None: show top 15
			// User: show user position and 5 either side
			// // Number: show rank number and 5 either side
			// const leaderboardRows = await PointsHelper.getLeaderboard(position);

			
			// // Give a placeholder whilst they're waiting.
			// const placeholderMsg = await MessagesHelper.selfDestruct(msg, `Calculating skill scores for ${skill}, please wait.`, 60000);

			// // Generate the leaderboard text and update the message.
			// const leaderboardMsgText = await PointsHelper.renderLeaderboard(leaderboardRows, position);
			// placeholderMsg.edit(leaderboardMsgText);

		} catch(e) {
			console.error(e);
		}
    }
    
};