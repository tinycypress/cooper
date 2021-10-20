import CoopCommand from "../../operations/activity/messages/coopCommand";
import DatabaseHelper from "../../operations/databaseHelper";
import { usableItemCodeGuard } from "../../operations/minigames/medium/economy/itemCmdGuards";
import ItemsHelper from "../../operations/minigames/medium/economy/items/itemsHelper";
import { ITEMS, MESSAGES, USERS } from "../../origin/coop";

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
					default: '*'
				}
			]
		});
	}

	async run(msg, { itemCode }) {
		super.run(msg);

		const validItemCode = ItemsHelper.interpretItemCodeArg(itemCode);
		if (itemCode !== '*' && !usableItemCodeGuard(msg, validItemCode, msg.author))
			return null;


		if (itemCode === '*') {
			let overallOwnershipData = await DatabaseHelper.manyQuery({
				name: 'all-item-shares',
				text: `SELECT DISTINCT ON (i.item_code) i.item_code, i.owner_id, i.quantity, total_qty, ROUND((i.quantity / total_qty) * 100) as share
                FROM items i
                    INNER JOIN ( 
                        SELECT item_code, MAX(quantity) AS highest, SUM(quantity) as total_qty
                        FROM items
                        GROUP BY item_code
                    ) AS grouped_items
                    ON  grouped_items.item_code = i.item_code
                    AND grouped_items.highest = i.quantity`
			});

			overallOwnershipData.sort((a, b) => (a.share < b.share) ? 1 : -1);

			// Crop the list to the first ten.
			overallOwnershipData = overallOwnershipData.slice(0, 25);

			let sharesText = `**Item ownership shares/market %:**\n\n` +
				overallOwnershipData.map(val => {
					const username = USERS._get(val.owner_id).user.username;
					const emoji = MESSAGES.emojiCodeText(val.item_code);
					const itemQty = `${ITEMS.displayQty(val.quantity)}x${emoji}`;
					return `${username}'s ${itemQty} (${val.share}%)`;
				}).join(', ') + '.';

			sharesText += '\n\n' + 
				'_Only showing the first 25 shares due to content length limit, will soon be shown on our website!!!_';

			// Output share of requested item (if valid)
			return MESSAGES.silentSelfDestruct(msg, sharesText);
		}

		
		// After ALL accounted, support codes, emojis, names.
		itemCode = ITEMS.interpretItemCodeArg(itemCode)


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
        const emoji = MESSAGES.emojiCodeText(itemCode);
        const ownershipText = `**${itemCode} ${emoji} ownership shares/market %:**\n\n` +
            meaningfulOwnersArr.map((val, index) => 
                `#${index + 1}. ` + 
                `${ITEMS.displayQty(val.quantity)} ` +
                `(${perc(val.quantity, itemTotal)}%) <@${val.owner_id}>`
            ).join('\n');

		// Output share of requested item (if valid)
		MESSAGES.silentSelfDestruct(msg, ownershipText);
    }

    
}