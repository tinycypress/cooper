import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

export default class ItemListCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'itemlist',
			group: 'economy',
			memberName: 'itemlist',
			aliases: ['il', 'list'],
			description: 'Retrieves a list of usable item codes',
			details: `Details of the itemlist command`,
			examples: ['itemlist', '!itemlist'],
		});
	}

	async run(msg) {
		super.run(msg);

		// TODO: Format and batch, 4 per line.
		const usableItems = ItemsHelper.getUsableItems()
			.map((itemCode) => ItemsHelper.beautifyItemCode(itemCode));

		const itemListChunks = [...Array(Math.ceil(usableItems.length / 4))].map(() => usableItems.splice(0, 4))

		const usableItemsMsgText = `**Usable Items:\n\n**` +
			itemListChunks.map(chunk => chunk.join(', ')).join('\n');

		MessagesHelper.selfDestruct(msg, usableItemsMsgText, 0, 10000);
    }
    
};