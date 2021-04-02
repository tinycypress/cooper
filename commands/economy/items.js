import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import EMOJIS from '../../core/config/emojis.json';

export default class ItemsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'items',
			group: 'economy',
			memberName: 'items',
			aliases: ['eggs', 'inv', 'inventory', 'i'],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `Details of the items command`,
			examples: ['items', 'an example of how coop-economics functions, trickle down, sunny side up Egg & Reaganonmics. Supply and demand.'],
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

	async run(msg, { targetUser, itemCode }) {
		super.run(msg);

		if (msg.mentions.users.first()) targetUser = msg.mentions.users.first();
		if (!targetUser) targetUser = msg.author;
		
		// Try to interpret itemCode/itemEmoji arg
		const itemInput = ItemsHelper.interpretItemCodeArg(itemCode);

        try {
			const name = targetUser.username;

			// Retrieve all item counts that user owns.
			if (itemCode === 'ALL') {
				const noItemsMsg = `${name} does not own any items.`;
				const items = await ItemsHelper.getUserItems(targetUser.id);
				if (items.length === 0) return MessagesHelper.selfDestruct(msg, noItemsMsg, 0, 5000);
				else {
					// Sort owned items by most first.
					items.sort((a, b) => (a.quantity < b.quantity) ? 1 : -1);

					const itemDisplayMsg = ItemsHelper.formItemDropText(targetUser, items);
					return MessagesHelper.selfDestruct(msg, itemDisplayMsg, 666, 30000);
				}
			}

			// Check if itemCode valid to use.
			if (!ItemsHelper.isUsable(itemInput))
				return MessagesHelper.selfDestruct(msg, `${name}, ${itemInput} seems invalid.`, 0, 5000);

			// Check a specific item instead.
			const itemQty = await ItemsHelper.getUserItemQty(targetUser.id, itemInput);
			
			// Send specific item count.

			const emoji = MessagesHelper.emojiText(EMOJIS[itemInput]);
			if (itemQty > 0)  
				return MessagesHelper.selfDestruct(msg, `${name} owns ${itemQty}x${itemInput} ${emoji}.`, 0, 5000);
			else 
				return MessagesHelper.selfDestruct(msg, `${name} does not own ${itemInput}.`, 0, 5000);


        } catch(err) {
            console.error(err);
        }
    }
    
};