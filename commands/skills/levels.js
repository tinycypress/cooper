import SkillsHelper from '../../community/features/skills/skillsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';


export default class LevelsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'levels',
			group: 'skills',
			memberName: 'levels',
			aliases: ['lvls'],
			description: 'This command lets you check your skill level(s)',
			details: `Details of the levels command`,
			examples: ['xp', '!xp laxative'],
			args: [
				{
					key: 'skillCode',
					prompt: 'Which skill to level check?',
					type: 'string'
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
			// skillCode = ItemsHelper.interpretskillCodeArg(skillCode);

			if (skillCode === '') {
				// Provide all skills

				const userSkills = await SkillsHelper.getSkills(msg.author.id);

				return MessagesHelper.selfDestruct(msg, 'ALL SKILLS XP 4 u!' + JSON.stringify(userSkills));
			}

			const skillCodeList = Object.keys(SkillsHelper.SKILLS);
			const isValid = skillCodeList.includes(skillCode.toUpperCase());

			// Check if input is a valid item code.
			if (!isValid)
				return MessagesHelper.selfDestruct(msg, `Invalid skill code ${skillCode}.`);


			// Calculate
			const level = await SkillsHelper.getLevel(skillCode, msg.author.id);

			return MessagesHelper.selfDestruct(msg, skillCode + ' levle 4 u: ' + level);




		} catch(e) {
			console.log('Error getting skill xp.');
			console.error(e);
		}
    }
    
};