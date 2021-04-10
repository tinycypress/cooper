import CraftingHelper from '../../operations/minigames/medium/skills/crafting/craftingHelper';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE, SERVER, TIME } from '../../origin/coop';


export default class IngredientsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'ingredients',
			group: 'skills',
			memberName: 'ingredients',
			aliases: ['ingred'],
			description: 'Check ingredients required for crafting an item',
			details: `Details of the ingredients command`,
			examples: ['!ingred', '!ingredients axe 10'],
			args: [
				{
					key: 'itemCode',
					prompt: 'Which item\s ingredients do you want to check?',
					type: 'string'
				},
				{
					key: 'qty',
					prompt: 'How many do you would want to craft?',
					type: 'integer',
					default: 1
				},
			],
		});
	}

	async run(msg, { itemCode, qty }) {
		super.run(msg);

		try {
			// Check if emoji and handle emoji inputs.
			itemCode = COOP.ITEMS.interpretItemCodeArg(itemCode);

			// Check if input is a valid item code.
			if (!itemCode)
				return COOP.MESSAGES.selfDestruct(msg, `Cannot craft invalid item code (${itemCode}).`, 0, 5000);

			// Check if item is craftable
			if (!CraftingHelper.isItemCraftable(itemCode))
				return COOP.MESSAGES.selfDestruct(msg, `${itemCode} is a valid item/code but uncraftable.`, 0, 7500);

			// Access required crafting level for item.
			const craftingItem = CraftingHelper.CRAFTABLES[itemCode];
			const craftItemEmoji = COOP.MESSAGES._displayEmojiCode(itemCode); 

			// Format text and send feedback.
			const ingredientsText = `Ingredients required for crafting ${craftItemEmoji} ${itemCode}x${qty}: ` + 
				Object.keys(craftingItem.ingredients).map(ingredKey => {
					const emoji = COOP.MESSAGES._displayEmojiCode(ingredKey);
					return `${emoji} ${ingredKey}x${craftingItem.ingredients[ingredKey] * qty}`;
				}).join(', ');

			return COOP.MESSAGES.selfDestruct(msg, ingredientsText, 0, 10000);


		} catch(e) {
			console.log('Error crafting item.');
			console.error(e);
		}
    }
    
}