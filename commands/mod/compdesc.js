import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { SERVER } from '../../origin/coop';

export default class CompetitionDescriptionCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'compdesc',
			group: 'mod',
			memberName: 'compdesc',
			description: '',
			examples: ['compdesc', 'compdesc COMPETITION_DESCRIPTION_HERE'],
			args: [
				{
					key: 'competition_event_code',
					prompt: 'Which competition is the description for?',
					type: 'string',
				},
				{
					key: 'description',
					prompt: 'Input the competition\'s description',
					type: 'string',
				},
			],
			ownerOnly: true
		});
	}

	async run(msg, { competition_event_code, description }) {
		super.run(msg);

		try {
			// Check if user is leader or commander
			console.log(msg.author);

			// Check if valid competition
			const COMP_KEYS = ['art_competition', 'business_competition', 'technology_competition'];
			console.log(COMP_KEYS)

			// Set it
		} catch (e) {
			console.error(e);
		}

	}

}