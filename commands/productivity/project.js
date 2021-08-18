import CoopCommand from '../../operations/activity/messages/coopCommand';
// import ProjectHelper from '../../operations/productivity/projects/projectHelper';
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

		// Take human readable due time.
		const dueDate = TIME.parseHuman(due);

		// Invalid input time feedback
		if (isNaN(dueDate))
			return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, ${due} is an invalid duration for a project deadline.`);

		// Calculate unix secs for due/deadline.
		const dueSecs = Math.round(dueDate.getTime() / 1000);

		// Prevent too long of a deadline.
		if (dueSecs >= TIME._secs() + 3.154e+7)
			return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, your deadline is too long (has to be less than a year).`);

		// TODO: Check the project does not already exist.

		// TODO: Create the project in suggestions for democratic approval.


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
    }
}


