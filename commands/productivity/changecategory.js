import Sugar from 'sugar';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import MessagesHelper from '../../operations/activity/messages/messagesHelper';
import TodoHelper from '../../operations/productivity/todos/todoHelper';
import COOP, { TIME } from '../../origin/coop';

export default class ChangeTodoCategoryCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'changecategory',
			group: 'productivity',
			memberName: 'changecategory',
			aliases: ['tdcat'],
			description: 'Information changecategory our fine community!',
			details: `Details`,
			examples: ['changecategory', 'changecategory example?'],
			args: [
				{
					key: 'id',
					prompt: 'Todo #id to change category for?',
					type: 'integer',
				},
				{
					key: 'category',
					prompt: 'Category to change it to?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, id, category) {
		super.run(msg);

		return MessagesHelper.silentSelfDestruct(msg,
			`This cannot change a todo's category yet, WIP`
		);
    }    
}