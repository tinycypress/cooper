import CoopCommand from '../../operations/activity/messages/coopCommand';
import { authorConfirmationPrompt } from '../../operations/common/ui';
import ProjectsHelper from '../../operations/productivity/projects/projectsHelper';
import { MESSAGES, TIME } from '../../origin/coop';

export default class ProjectCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'project',
			group: 'productivity',
			memberName: 'project',
			description: 'This command is used to suggest the creation of a community project with a deadline.',
			details: `Details`,
			examples: ['project', 'project example?'],
			args: [
				{
					key: 'title',
					prompt: 'Project title?',
					type: 'string'
				},
				{
					key: 'due',
					prompt: 'Project deadline future time? Ex. next Tuesday, 3pm Wednesday, in 30 minutes, in half a year... etc',
					type: 'string'
				},
			]
		});
	}

	async run(msg, { title, due }) {
		super.run(msg);

		// Check deadline is valid.
		if (!ProjectsHelper.isValidDeadline(due))
			return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, ${due} is an invalid duration for a project deadline.`);

		// Check title is valid.


		// Acknowledge 
		const confirmText = '**Create !project?** Details:\n\n' +

			'Title: ' + title + '\n' +
			'Due: ' + due + '\n\n' +

			'_Please react with tick to propose the project\'s creation!_';

		// Use the confirmation from the coin flip feature! :D
		const confirmMsg = await authorConfirmationPrompt(msg, confirmText, msg.author.id);

		if (confirmMsg) 
			MESSAGES.silentSelfDestruct(msg, 'Oh you are really sure...');
		else 
			MESSAGES.silentSelfDestruct(msg, 'Fine, I won\'t.');
    }
}


// TODO: Check the project does not already exist.

// TODO: Create the project in suggestions for democratic approval.

// return MESSAGES.silentSelfDestruct(msg, "!project command work in progress.");

// Add a TODO for this user.
// const result = await TodoHelper.add(msg.author.id, {
// 	title, due: dueSecs, category
// });

// Handle already exists error
// if (result === 'ALREADY_EXISTS')
	// return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, you already have a todo entry with that title!`);

// Feedback.
// const secsNow = TIME._secs();
// const deadline = TIME.humaniseSecs(Math.max(dueSecs - secsNow, 0));
// return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, your todo was created!\n\n` +
// 	title +
// 	`\n\nDeadline: ${deadline}`);


// // Take human readable due time.
// const dueDate = TIME.parseHuman(deadline);

// // Convert category to lower case for better matches.
// visibility = visibility.toLowerCase();

// // Invalid input time feedback
// if (isNaN(dueDate))
// 	return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, ${deadline} is invalid duration for a project deadline`);

// // Limit complexity to giving them the correct format to use... pick up slack in !suggest for it
// const tempFmtText = `<@${msg.author.id}>, generating the following message for creating your project channel:`;

// const projectData = { name, deadline, description, visibility };
// const suggestionText = `!suggest CREATE_PROJECT\n` +
// 	PROJECT_ARGS_MSG_ORDER.map(arg => 
// 		`${MESSAGES.titleCase(arg)}: ${projectData[arg]}`
// 	).join(' | ');

// const suggestHelpMsg = await MESSAGES.silentSelfDestruct(msg, tempFmtText, 0, 20000);
// MESSAGES.delayEdit(suggestHelpMsg, suggestionText, 2000);