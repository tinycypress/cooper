import Sugar from 'sugar';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import MessagesHelper from '../../operations/activity/messages/messagesHelper';
import TodoHelper from '../../operations/productivity/todos/todoHelper';
import COOP, { TIME } from '../../origin/coop';

export default class TodoCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'todo',
			group: 'productivity',
			memberName: 'todo',
			aliases: ['td'],
			description: 'Information todo our fine community!',
			details: `Details`,
			examples: ['todo', 'todo example?'],
			arguments: [
				{
					key: 'title',
					prompt: 'TODO title?',
					type: 'string',
					default: ''
				},
				{
					key: 'due',
					prompt: 'TODO deadline? Ex. 1d, 5h, 10secs',
					type: 'string',
					default: ''
				},
				{
					key: 'category',
					prompt: 'TODO category? (GENERAL)',
					type: 'string',
					default: 'GENERAL'
				},
			]
		});
	}

	async run(msg, title, due, category) {
		super.run(msg);

		// TODO: Take human readable due time.
		// https://sugarjs.com/dates/#/Parsing
		// https://stackoverflow.com/questions/52230177/what-is-the-easiest-way-to-deserialize-human-readable-time-duration-in-java
		const dueDate = new Sugar.Date(due);

		// Use a confirmation collector for this due to possible misinterpretation.

		// TODO: Invalid input time feedback
		if (!dueDate.isValid)
			return MessagesHelper.silentSelfDestruct(msg, `<@${msg.author.id}> ${due} is invalid duration for a todo task.`);

		// TODO: Add a TODO for this user.
		const result = await TodoHelper.add(msg.author.id, {
			title,
			due: Math.round(dueDate.now() / 1000),
			category
		});
		
		// Handle already exists error
		if (result === 'ALREADY_EXISTS')
			return MessagesHelper.silentSelfDestruct(msg, `<@${msg.author.id}> you already have a todo entry with that title!`);
		
		// Feedback.
		return MessagesHelper.silentSelfDestruct(msg, `<@${msg.author.id}> your todo was created!`);
    }    
}