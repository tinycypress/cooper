// import SkillsHelper from '../../community/features/skills/skillsHelper';
import SkillsHelper from '../../operations/minigames/medium/skills/skillsHelper';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE, SERVER, TIME } from '../../origin/coop';


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
			// TODO: Check most xp and give skill-score role
		
			// const leaderboardMsgText = await COOP.POINTS.renderLeaderboard(leaderboardRows, position);

			// If ALL skills, return total/top breakdown based on total.
			if (skill === 'ALL') {
				const totalLeaderboard = await SkillsHelper.getTotalXPLeaderboard();

				const totalLeaderboardText = `**Top ${15 + position} __total__ XP skillers**\n\n` + 
				totalLeaderboard.map((skillRow, index) => {
					const { user } = COOP.USERS._get(skillRow.player_id);
					return `#${(index + 1) + position}: ${user.username} ${skillRow.total_xp}XP`;
				}).join('\n');

				return COOP.MESSAGES.selfDestruct(msg, totalLeaderboardText);

			// Return a specific skill leaderboard if valid.
			} else {
				const skillLeaderboard = await SkillsHelper.getSkillXPLeaderboard(skill);

				const skillLeaderboardText = `**Top ${15 + position} ${skill} XP skillers**\n\n` + 
					skillLeaderboard.map((skillRow, index) => {
						const { user } = COOP.USERS._get(skillRow.player_id);
						const xp = skillRow[skill] ? skillRow[skill] : 0;
						return `#${(index + 1) + position}: ${user.username} ${xp}XP`;
					}).join('\n');

				return COOP.MESSAGES.selfDestruct(msg, skillLeaderboardText);
			}


		} catch(e) {
			console.error(e);
		}
    }
    
};