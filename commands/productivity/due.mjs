import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import MessagesHelper from '../../operations/activity/messages/messagesHelper.mjs';
import { MESSAGES, TIME } from '../../origin/coop.mjs';

export default class DueWithinCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'duewithin',
			group: 'productivity',
			memberName: 'duewithin',
			aliases: ['duewithin', 'duew'],
			description: 'Information todo our fine community!',
			details: `Details`,
			examples: ['todo', 'todo example?'],
			args: [
				{
					key: 'withinTimeframe',
					prompt: 'Timeframe to check for due todos?',
					type: 'string',
					default: 'tomorrow'
				},
				{
					key: 'category',
					prompt: 'TODO category? (all)',
					type: 'string',
					default: 'all'
				},
			]
		});
	}

	async run(msg, withinTimeframe, category) {
		super.run(msg);


		// Parse by human date input, see if any are due.
		const timeframe = TIME.parseHuman(withinTimeframe);

		// Guard against invalid time frames
		if (isNaN(timeframe))
			return MESSAGES.silentSelfDestruct(msg, 'Invalid timeframe for checking todos provided', 333, 10000);

		// Load all todos of specified/default category.
		// const todos = await TodoHelper.getUserTodos(msg.author.id, category);

		// TODO: Calculate which are overdue.


		// TODO: Tell them if they have none over due by HUMANISED TIME

		const referenceReadable = TIME.humaniseSecs(Math.round(timeframe.getTime() / 1000))

		// dev message
		const feedbackText = `**<@${msg.author.id}>'s todos due (within ${referenceReadable})**` +
			`...WIP? Category: ${category}` +
			`\n\n_Check yours by typing: !due <timeframe> <category>`;

		MessagesHelper.silentSelfDestruct(msg, feedbackText);
    }    
}
