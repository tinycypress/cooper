import CoopCommand from '../../operations/activity/messages/coopCommand';
import { PROJECT_ARGS_MSG_ORDER } from '../../operations/productivity/projects/projectsHelper';
import { MESSAGES, TIME } from '../../origin/coop';

export default class NewProjectCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'newproject',
			group: 'productivity',
			memberName: 'newproject',
			aliases: ['newp'],
			description: 'Description',
			details: `Details`,
			examples: ['!newproject'],
			args: [
				{
					key: 'name',
					prompt: 'Proposed project title?',
					type: 'string',
				},
				{
					key: 'deadline',
					prompt: 'Project deadline future time? Ex. next Tuesday, 3pm Wednesday, in 30 minutes, in half a year... etc',
					type: 'string',
				},
				{
					key: 'description',
					prompt: 'Project description',
					type: 'string'
				},
				{
					key: 'visibility',
					prompt: 'Project channel visibility (public|private)',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { name, deadline, description, visibility }) {
		super.run(msg);

		// Take human readable due time.
		const dueDate = TIME.parseHuman(deadline);

		// Convert category to lower case for better matches.
		visibility = visibility.toLowerCase();

		// Invalid input time feedback
		if (isNaN(dueDate))
			return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, ${deadline} is invalid duration for a project deadline`);

		// Limit complexity to giving them the correct format to use... pick up slack in !suggest for it
		const tempFmtText = `<@${msg.author.id}>, generating the following message for creating your project channel:`;

		const projectData = { name, deadline, description, visibility };
		const suggestionText = `!suggest CREATE_PROJECT\n` +
			PROJECT_ARGS_MSG_ORDER.map(arg => 
				`${MESSAGES.titleCase(arg)}: ${projectData[arg]}`
			).join(' | ');

		const suggestHelpMsg = await MESSAGES.silentSelfDestruct(msg, tempFmtText, 0, 20000);
		MESSAGES.delayEdit(suggestHelpMsg, suggestionText, 2000);
    }
}