import CoopCommand from '../../operations/activity/messages/coopCommand';
import MessagesHelper from '../../operations/activity/messages/messagesHelper';
import TodoHelper from '../../operations/productivity/todos/todoHelper';
import COOP from '../../origin/coop';

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


		// TODO: Check if due time can be parsed

		// Use a confirmation collector for this due to possible misinterpretation.

		// TODO: Add a TODO for this user.
		const result = await TodoHelper.add(msg.author.id, {
			title,
			due,
			category
		});

		// Handle already exists error
		if (result === 'ALREADY_EXISTS')
			return MessagesHelper.silentSelfDestruct(msg, `<@${msg.author.id}> you already have a todo entry with that title!`);

		
    }    
}