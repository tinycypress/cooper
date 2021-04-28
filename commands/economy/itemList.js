import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';

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

		// Format usable items list.
		const usableItems = COOP.USABLE.getUsableItems()
			.map((itemCode) => COOP.ITEMS.beautifyItemCode(itemCode));

		// batch, 4 per line.
		const itemListChunks = [...Array(Math.ceil(usableItems.length / 4))].map(() => usableItems.splice(0, 4))

		// Send the text.
		const usableItemsMsgText = `**Usable Items:\n\n**` +
			itemListChunks.map(chunk => chunk.join(', ')).join('\n');
		COOP.MESSAGES.selfDestruct(msg, usableItemsMsgText, 0, 10000);
    }
    
}