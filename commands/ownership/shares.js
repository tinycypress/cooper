import CoopCommand from "../../operations/activity/messages/coopCommand";
import DatabaseHelper from "../../operations/databaseHelper";
import { usableItemCodeGuard } from "../../operations/minigames/medium/economy/itemCmdGuards";
import ItemsHelper from "../../operations/minigames/medium/economy/items/itemsHelper";
import { ITEMS, MESSAGES } from "../../origin/coop";

// TODO: Refactor to a different location.
const perc = (sub, total) => Math.round((sub / total) * 100);

export default class SharesCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'shares',
			group: 'ownership',
			memberName: 'shares',
			aliases: ['sh'],
			description: 'Calculates the % ownership of items or a specific item amongst population.',
			details: ``,
			examples: ['!shares IRON_BAR'],
			args: [
				{
					key: 'itemCode',
					type: 'string',
					prompt: 'Which item code do you want to check the shares %?',
				}
			]
		});
	}

	async run(msg, { itemCode }) {
		super.run(msg);

		const validItemCode = ItemsHelper.interpretItemCodeArg(itemCode);
		if (itemCode !== '*' && !usableItemCodeGuard(msg, validItemCode, msg.author))
			return null;

		// Select all owners and their quantities of this item.
        const itemOwnershipArr = await DatabaseHelper.manyQuery({
            name: 'get-item-shares',
            text: `SELECT quantity, owner_id FROM items WHERE item_code = $1`,
            values: [itemCode]
        });

		// Calculate the total quantity of this item from the records.
        const itemTotal = itemOwnershipArr.reduce((acc, val) => acc += val.quantity, 0);

		// Filter any meaningless entries out.
        const meaningfulOwnersArr = itemOwnershipArr.filter(val => perc(val.quantity, itemTotal) > 0);
        
        // Sort it by biggest first.
        meaningfulOwnersArr.sort((a, b) => (a.quantity < b.quantity) ? 1 : -1);
		
		// Format and output the resulting message/info.
        const emoji = MESSAGES._displayEmojiCode(item);
        const ownershipText = `**${item} ${emoji} ownership shares/market %:**\n\n` +
            meaningfulOwnersArr.map((val, index) => 
                `#${index}. <@${val.owner_id}>` + 
                `${ITEMS.displayQty(val.quantity)}` +
                `(${perc(val.quantity, itemTotal)}%)`
            ).join('\n');

		// Output share of requested item (if valid)
		MESSAGES.silentSelfDestruct(msg, ownershipText);
    }

    
}