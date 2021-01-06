import ItemsHelper from '../../../bot/community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';

export default class ItemsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'items',
			group: 'economy',
			memberName: 'items',
			aliases: ['eggs', 'inv', 'inventory', 'i'],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `Details of the items command`,
			examples: ['items', 'an example of how coop-econmics functions, trickle down, sunny side up Egg & Reagonmics. Supply and demand.'],
		});
	}

	async run(msg) {
		super.run(msg);

		let targetUser = msg.author;
		if (msg.mentions.users.first()) targetUser = msg.mentions.users.first();

        try {
			const noItemsMsg = `${targetUser.username} does not own any items.`;
			const items = await ItemsHelper.getUserItems(targetUser.id);
			
			if (items.rows.length === 0) await msg.say(noItemsMsg);
			else {
				const itemDisplayMsg = ItemsHelper.formItemDropText(targetUser, items.rows);
				await msg.say(itemDisplayMsg);
			}

        } catch(err) {
            console.error(err);
        }
    }
    
};