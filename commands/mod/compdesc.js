import CoopCommand from '../../operations/activity/messages/coopCommand';
import CompetitionHelper from '../../operations/social/competitionHelper';
import { CHANNELS } from '../../origin/config';
import { MESSAGES, ROLES } from '../../origin/coop';

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
			]
		});
	}

	async run(msg, { competition_event_code, description }) {
		super.run(msg);

		console.log(competition_event_code, description);

		try {
			// Check if user is leader or commander.
			if (!ROLES._idHasCode(msg.author.id, 'COMMANDER') && !ROLES._idHasCode(msg.author.id, 'LEADER'))
				return MESSAGES.silentSelfDestruct(msg, 'Only the Commander or Leaders can use this command.');

			// Check if valid competition code.
			const COMP_KEYS = ['art_competition', 'business_competition', 'technology_competition'];
			if (!COMP_KEYS.includes(competition_event_code.toLowerCase()))
				return MESSAGES.silentSelfDestruct(msg, `Competition event code must be one of these codes: ${COMP_KEYS.join(', ')}.`);

			// Set it to the message content and database.
			const compMsg = await MESSAGES.getByLink(CHANNELS[competition_event_code.toUpperCase()]);
			await compMsg.edit(description);

			// Set description 
			await CompetitionHelper.setDescription(competition_event_code, description);

		} catch (e) {
			console.error(e);
		}

	}

}