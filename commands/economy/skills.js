import ItemsHelper from '../../community/features/items/itemsHelper';
import SkillsHelper, { SKILLS } from '../../community/features/skills/skillsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

export default class SkillsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'skills',
			group: 'economy',
			memberName: 'skills',
			aliases: ['s'],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `Details of the skills command`,
			examples: ['skills', 'an example of how coop-economics functions, trickle down, sunny side up Egg & Reaganonmics. Supply and demand.'],
		});
	}

	async run(msg) {
		super.run(msg);

		// TODO: Improve formatting.
		const skillNames = Object.keys(SKILLS);
		
		MessagesHelper.selfDestruct(msg,
			`**Skills of Coopverse**\n\n` + skillNames.join(', ')
		);
    }
    
};