import SkillsHelper, { SKILLS } from '../../operations/minigames/medium/skills/skillsHelper.mjs';

import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import COOP from '../../origin/coop.mjs';


export default class NextLevelCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'nextlevel',
			group: 'skills',
			memberName: 'nextlevel',
			aliases: ['nextlvl'],
			description: 'This command lets you check xp distance to your next skill level.',
			details: `Details of the nextlevel command`,
			examples: ['nextlevel', '!nextlevel crafting'],
			args: [
				{
					key: 'skillCode',
					prompt: 'Which skill would you like to check next level xp for?',
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
			skillCode = skillCode.toLowerCase();

			if (skillCode === '') {
				
				// Provide all skills
				const userSkills = await SkillsHelper.getSkills(msg.author.id);

				// TODO: Calculate next level differences for all.

				const allSkillsText = `**${username}'s next level skill XPs :**\n\n` +
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

			// TODO: Calculate next level diff
			const diff = 1337 + xp;

			const levelText = `${username}'s next ${skillCode} level (${level + 1}) is ${diff} xp away!`;
			return COOP.MESSAGES.selfDestruct(msg, levelText);



		} catch(e) {
			console.log('Error getting next level diff xp.');
			console.error(e);
		}
    }
    
}





