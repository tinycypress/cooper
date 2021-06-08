import { SKILLS } from '../../operations/minigames/medium/skills/skillsHelper';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';


export default class SkillsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'skills',
			group: 'economy',
			memberName: 'skills',
			aliases: ['s'],
			description: 'Lists the skills.',
			examples: ['!skills'],
		});
	}

	async run(msg) {
		super.run(msg);

		// TODO: Improve formatting.
		const skillNames = Object.keys(SKILLS);
		
		COOP.MESSAGES.selfDestruct(msg,
			`**Skills of Coopverse**\n\n` + skillNames.join(', ')
		);
    }
    
}