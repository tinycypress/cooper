import CoopCommand from '../../operations/activity/messages/coopCommand';
import MessagesHelper from '../../operations/activity/messages/messagesHelper';
import TodoHelper from '../../operations/productivity/todos/todoHelper';
import COOP from '../../origin/coop';

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
			arguments: [
				{
					key: 'withinTimeframe',
					prompt: 'Timeframe to check for due todos?',
					type: 'string',
					default: '6hrs'
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

	async run(msg, withinTimeframe, category) {
		super.run(msg);

		const todos = await TodoHelper.getUserTodos(msg.author.id, category);

		// TODO: Acknowledge the category again for confirmation.
		MessagesHelper.silentSelfDestruct(msg, 'Getting your todos due within given timeframe!');

		
    }    
}
