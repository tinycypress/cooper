import SkillsHelper, { SKILLS } from '../../operations/minigames/medium/skills/skillsHelper';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';


export default class XpCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'xp',
			group: 'skills',
			memberName: 'xp',
			aliases: [],
			description: 'This command lets you xp the items you want',
			details: `Details of the xp command`,
			examples: ['xp', '!xp laxative'],
			args: [
				{
					key: 'skillCode',
					prompt: 'Which skill to XP check?',
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
			// skillCode = interpretskillCodeArg(skillCode);
			skillCode = skillCode.toLowerCase();

			if (skillCode === '') {
				
				// Provide all skills
				const userSkills = await SkillsHelper.getSkills(msg.author.id);

				const allSkillsText = `**${username}'s skill XPs :**\n\n` +
					Object.keys(userSkills).map(skillKey => 
							`${skillKey}: ${userSkills[skillKey].xp} XP, ` +
							`level ${userSkills[skillKey].level}`
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

			const levelText = `${username} has ${xp} ${skillCode} XP (level ${level})!`;
			return COOP.MESSAGES.selfDestruct(msg, levelText);



		} catch(e) {
			console.log('Error getting skill xp.');
			console.error(e);
		}
    }
    
}