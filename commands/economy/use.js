import FlareHandler from '../../community/features/items/handlers/flareHandler';
import LaxativeHandler from '../../community/features/items/handlers/laxativeHandler';
import ItemsHelper from '../../community/features/items/itemsHelper';
import GiftboxHandler from '../../community/features/items/handlers/giftboxHandler';
import CoopCommand from '../../core/entities/coopCommand';
import ShieldHandler from '../../community/features/items/handlers/shieldHandler';
import MessagesHelper from '../../core/entities/messages/messagesHelper';


export default class UseCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'use',
			group: 'economy',
			memberName: 'use',
			aliases: ['u'],
			description: 'This command lets you use the items you own',
			details: `Details of the use command`,
			examples: ['use', '!use laxative'],
			args: [
				{
					key: 'itemCode',
					prompt: 'What is the code of the item you wish to use? !itemlist if not sure',
					type: 'string'
				},
			],
		});
	}

	async run(msg, { itemCode }) {
		super.run(msg);

		// Interpret item code from text/string/emoji/item_code.
		itemCode = ItemsHelper.interpretItemCodeArg(itemCode);

		// Check the user is providing a valid item code after interpretation.
		const usableItems = ItemsHelper.getUsableItems();
		const noMatchErrText = 'Please provide a valid item name or check with !itemlist';
		if (!usableItems.includes(itemCode)) 
			return MessagesHelper.selfDestruct(msg, noMatchErrText, 5000);

		// TODO: Would probably be smart to just add the insufficient qty here...
			// Save checking it over and over.
			// if (useFailed)
				// return MessagesHelper.selfDestruct(msg, 'You don't own that item to use it (code)', 5000);

		// Item is usable, therefore use it.
		if (itemCode === 'LAXATIVE') LaxativeHandler.use(msg, msg.author);
		if (itemCode === 'FLARE') FlareHandler.use(msg, msg.author);
		if (itemCode === 'EMPTY_GIFTBOX') GiftboxHandler.use(msg);
		if (itemCode === 'SHIELD') ShieldHandler.use(msg);
    }
    
};