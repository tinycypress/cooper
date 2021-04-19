


import CoopCommand from '../../operations/activity/messages/coopCommand';
import MessagesHelper from '../../operations/activity/messages/messagesHelper';
import TodoHelper from '../../operations/productivity/todos/todoHelper';
import COOP, { MESSAGES, TIME } from '../../origin/coop';

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
			args: [
				{
					key: 'category',
					prompt: 'TODO category? (all)',
					type: 'string',
					default: 'all'
				},
				{
					key: 'targetUser',
					prompt: 'Whose items are you trying to check?',
					type: 'user',
					default: ''
				},
			]
		});
	}

	async run(msg, { category, targetUser }) {
		super.run(msg);

		// Allow them to shorthand it with a dot.
		if (category === '.') category = 'all';

		// Allow shorthand and blank options on target user.
		if (!targetUser) {
			const firstMention = msg.mentions.users.first();
			if (firstMention) targetUser = firstMention
			else targetUser = msg.author;
		}


		const todos = await TodoHelper.getUserTodos(targetUser.id, category);

		// Guard against having no todos.
		if (todos.length === 0) {
			const noTodosText = `<@${targetUser.id}>, you don't have any todos. Use !todo to add one.`;
			return MESSAGES.silentSelfDestruct(msg, noTodosText);
		}


        const secsNow = TIME._secs();
        const dueReadable = due => {
			console.log(TIME.humaniseSecs(due - secsNow), due, secsNow);
			return TIME.humaniseSecs(due - secsNow);
		}

        const userTodosText = `**${targetUser}'s todos:**\n\n` +
            todos.map(
                // TODO: Bold/underline the due date if overdue...
                todo => `#${todo.id}. ${todo.title} - ${dueReadable(todo.due)}`
            ).join('\n') +
            `\n\n_Type and send "!todos" to check yours._`;

		MESSAGES.silentSelfDestruct(msg, userTodosText);
    }    
}