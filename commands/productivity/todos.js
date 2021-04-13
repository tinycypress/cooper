


import CoopCommand from '../../operations/activity/messages/coopCommand';
import MessagesHelper from '../../operations/activity/messages/messagesHelper';
import TodoHelper from '../../operations/productivity/todos/todoHelper';
import COOP from '../../origin/coop';

export default class TodosCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'todos',
			group: 'productivity',
			memberName: 'todos',
			aliases: ['mytodos'],
			description: 'Information todo our fine community!',
			details: `Details`,
			examples: ['todo', 'todo example?'],
			arguments: [
				{
					key: 'category',
					prompt: 'TODO category? (GENERAL)',
					type: 'string',
					default: 'GENERAL'
				}
			]
		});
	}

	async run(msg, category) {
		super.run(msg);


		const todos = await TodoHelper.getUserTodosCategory(msg.author.id, category);

		// TODO: Acknowledge the category again for confirmation.
		MessagesHelper.silentSelfDestruct(msg, 'Getting your todos! Chill.');
    }    
}