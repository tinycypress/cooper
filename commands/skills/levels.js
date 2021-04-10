import SkillsHelper, { SKILLS } from '../../operations/minigames/medium/skills/skillsHelper';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';


export default class LevelsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'levels',
			group: 'skills',
			memberName: 'levels',
			aliases: ['lvls', 'lvl'],
			description: 'This command lets you check your skill level(s)',
			details: `Details of the levels command`,
			examples: ['!lvl', '!lvl crafting'],
			args: [
				{
					key: 'skillCode',
					prompt: 'Which skill to level check?',
					type: 'string',
					default: ''
				},
			],
		});
	}

	async run(msg, { skillCode }) {
		super.run(msg);

		// Shorthand for feedback.
		const username = msg.author.username;

		try {
			// Check if emoji and handle emoji inputs.
			// skillCode = COOP.ITEMS.interpretskillCodeArg(skillCode);
			skillCode = skillCode.toLowerCase();
			
			if (skillCode === '') {
				// Provide all skills

				const userSkills = await SkillsHelper.getSkills(msg.author.id);

				const allSkillsText = `**${username}'s skill levels:**\n\n` +
					Object.keys(userSkills).map(skillKey => 
							`${skillKey}: Level ${userSkills[skillKey].level}, ` +
							`(${userSkills[skillKey].xp} XP)`
						).join('\n');

				return COOP.MESSAGES.selfDestruct(msg, allSkillsText);
			}

			const skillCodeList = Object.keys(SKILLS);
			const isValid = skillCodeList.includes(skillCode.toUpperCase());

			// Check if input is a valid item code.
			if (!isValid)
				return COOP.MESSAGES.selfDestruct(msg, `Invalid skill code ${skillCode}.`);


			// Calculate
			const level = await SkillsHelper.getLevel(skillCode, msg.author.id);
			const xp = await SkillsHelper.getXP(skillCode, msg.author.id);

			const levelText = `${username} has level ${level} ${skillCode} (${xp}XP)!`
			return COOP.MESSAGES.selfDestruct(msg, levelText);




		} catch(e) {
			console.log('Error getting skill xp.');
			console.error(e);
		}
    }
    
}