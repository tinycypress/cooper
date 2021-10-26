import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import TodoHelper from '../../operations/productivity/todos/todoHelper.mjs';
import { CHANNELS, MESSAGES } from '../../origin/coop.mjs';


// #42. Gay tuesday - a day
// #43. Fix todos - 2 days
// #46. test - 4 days
// #48. Please sefy - a year

export default class TodoCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'todone',
			group: 'productivity',
			memberName: 'todone',
			aliases: ['tdn'],
			description: 'Information todone our fine community!',
			details: `Details`,
			examples: ['todone', 'todone example?'],
			args: [
				{
					key: 'todoID',
					prompt: 'Todo #ID you are declaring completed.',
					type: 'integer',
				},
			]
		});
	}

	async run(msg, { todoID }) {
		super.run(msg);

		// Take human readable due time.
		const inputTodo = todoID;

		// Invalid input time feedback
		todoID = parseInt(todoID);
		if (isNaN(todoID))
			return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, #${inputTodo} is an invalid todo #ID.`);

		// Try to load todo
		const todo = await TodoHelper.get(todoID);
		
		// Check if this user owns that id.
		if (todo.user_id !== msg.author.id)
			return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, todo #${todoID} is not yours to modify.`);

			
		// Remove a TODO for this user.
		const result = await TodoHelper.remove(todoID);
				
		// Handle already exists error
		if (!result)
			return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, failed to mark todo #${todoID} as done!`);
			
		// Calculate unix secs for due/deadline.

		// const dueSecs = Math.round(todoID.getTime() / 1000);
		// Feedback.
		// const secsNow = TIME._secs();
		// const deadline = TIME.humaniseSecs(Math.max(dueSecs - secsNow, 0));
		// return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, your todo was created!\n\n` +
		// 	title +
		// 	`\n\nDeadline: ${deadline}`);

		// TODO: Calculate how much time was remaining
		
		// TODO: Add stars to success message and some kind of reaction event for stars now..? Validate DONE
		const successTodoText = `<@${msg.author.id}>, marked todo #${todoID} as done!\n\n` +
			`"${todo.title}"`;

		CHANNELS.silentPropagate(msg, successTodoText, 'ACHIEVEMENTS');
    }
}

