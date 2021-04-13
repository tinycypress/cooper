import CoopCommand from '../../operations/activity/messages/coopCommand';
import MessagesHelper from '../../operations/activity/messages/messagesHelper';
import TodoHelper from '../../operations/productivity/todos/todoHelper';
import COOP from '../../origin/coop';

export default class DueTodosCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'duetodos',
			group: 'productivity',
			memberName: 'duetodos',
			aliases: ['myduetodos', 'due'],
			description: 'Information todo our fine community!',
			details: `Details`,
			examples: ['todo', 'todo example?'],
			arguments: [
				{
					key: 'category',
					prompt: 'TODO category? (GENERAL)',
					type: 'string',
					default: 'GENERAL'
				},
			]
		});
	}

	async run(msg, category) {
		super.run(msg);



		const todos = await TodoHelper.getUserTodos(msg.author.id, category);

		// TODO: Acknowledge the category again for confirmation.
		MessagesHelper.silentSelfDestruct(msg, 'Getting your due/late todos! Chill... it\'s your fault for being late anyway...');

		
    }    
}
