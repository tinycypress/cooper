import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import COOP, { USABLE } from '../../origin/coop.mjs';
import { EMOJIS } from '../../origin/config.mjs';


export default class ItemsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'items',
			group: 'economy',
			memberName: 'items',
			aliases: ['eggs', 'inv', 'inventory', 'i'],
			description: 'Lists the current items you own',
			examples: ['!items'],
			args: [
				{
					key: 'targetUser',
					prompt: 'Whose items are you trying to check?',
					type: 'user',
					default: ''
				},
				{
					key: 'itemCode',
					prompt: 'Which item code (default ALL)?',
					type: 'string',
					default: 'ALL'
				},
			]
		});
	}


	// TODO: If no targer user provided, but first argument is valid item code
		// then return that item type count owned by the person asking
	async run(msg, { targetUser, itemCode }) {
		super.run(msg);

		if (msg.mentions.users.first()) targetUser = msg.mentions.users.first();
		if (!targetUser) targetUser = msg.author;
		
		// Try to interpret itemCode/itemEmoji arg
		const itemInput = COOP.ITEMS.interpretItemCodeArg(itemCode);

        try {

			const name = targetUser.username;

			// Retrieve all item counts that user owns.
			if (itemCode === 'ALL') {
				const noItemsMsg = `${name} does not own any items.`;
				const items = await COOP.ITEMS.getUserItems(targetUser.id);
				if (items.length === 0) return COOP.MESSAGES.selfDestruct(msg, noItemsMsg, 0, 5000);
				else {
					// Sort owned items by most first.
					items.sort((a, b) => (a.quantity < b.quantity) ? 1 : -1);

					const itemDisplayMsg = COOP.ITEMS.formItemDropText(targetUser, items);
					return COOP.MESSAGES.selfDestruct(msg, itemDisplayMsg, 666, 30000);
				}
			}

			// Check if itemCode valid to use.
			if (!USABLE.isUsable(itemInput))
				return COOP.MESSAGES.selfDestruct(msg, `${name}, ${itemInput} seems invalid.`, 0, 5000);

			// Check a specific item instead.
			const itemQty = await COOP.ITEMS.getUserItemQty(targetUser.id, itemInput);
			const displayQty = COOP.ITEMS.displayQty(itemQty);

			// Send specific item count.
			const emoji = COOP.MESSAGES.emojiText(EMOJIS[itemInput]);
			if (itemQty > 0)  
				return COOP.MESSAGES.selfDestruct(msg, `${name} owns ${displayQty}x${itemInput} ${emoji}.`, 0, 5000);
			else 
				return COOP.MESSAGES.selfDestruct(msg, `${name} does not own any ${itemInput}.`, 0, 5000);


        } catch(err) {
            console.error(err);
        }
    }
    
}