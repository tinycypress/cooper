import SkillsHelper from '../../operations/minigames/medium/skills/skillsHelper.mjs';

import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import COOP from '../../origin/coop.mjs';

export default class LevelXPCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'xplevel',
			group: 'skills',
			memberName: 'xplevel',
			aliases: ['xplvl'],
			description: 'Converts an XP number into its skill level boundary.',
			details: `Details of the xplevel command`,
			examples: ['!xplvl 500000'],
			args: [
				{
					key: 'xp',
					prompt: 'How much XP do you want to skill level check?',
					type: 'integer',
					default: 1
				},
			],
		});
	}

	async run(msg, { xp }) {
		super.run(msg);

		const level = SkillsHelper.calcLvl(xp);

		const levelText = `${xp}XP gives you level ${level} in a skill!`;
		return COOP.MESSAGES.selfDestruct(msg, levelText, 5000);
    }
    
}