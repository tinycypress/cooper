import SkillsHelper from '../../operations/minigames/medium/skills/skillsHelper.mjs';

import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import COOP from '../../origin/coop.mjs';


export default class LevelXPCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'levelxp',
			group: 'skills',
			memberName: 'levelxp',
			aliases: ['lvlxp'],
			description: 'Converts a level into its required XP.',
			details: `Details of the levelxp command`,
			examples: ['!xp laxative'],
			args: [
				{
					key: 'level',
					prompt: 'Which level number to check XP for?',
					type: 'integer',
					default: 1
				},
			],
		});
	}

	async run(msg, { level }) {
		super.run(msg);

		const xpRequired = SkillsHelper.calcXP(level);

		const levelText = `${xpRequired}XP required for level ${level}!`;
		return COOP.MESSAGES.selfDestruct(msg, levelText);
    }
    
}