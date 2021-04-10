import CraftingHelper from '../../operations/minigames/medium/skills/crafting/craftingHelper';
import SkillsHelper from '../../operations/minigames/medium/skills/skillsHelper';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE, SERVER, TIME } from '../../origin/coop';


export default class CraftCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'craft',
			group: 'skills',
			memberName: 'craft',
			aliases: ['c'],
			description: 'This command lets you craft the items you want',
			details: `Details of the craft command`,
			examples: ['craft', '!craft laxative'],
			args: [
				{
					key: 'itemCode',
					prompt: 'What is the code of the item you wish to use? !itemlist if not sure',
					type: 'string'
				},
				{
					key: 'qty',
					prompt: 'How many do you want to craft?',
					type: 'integer',
					default: 1
				},
			],
		});
	}

	async run(msg, { itemCode, qty }) {
		super.run(msg);

		// Shorthand for feedback.
		const userID = msg.author.id;

		// Cap the number at 0 minimum and refactor into a common guard/validator.
		qty = Math.max(qty, 0);

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

			// Check the user has a high enough crafting level.
			const crafterLevel = await SkillsHelper.getLevel('crafting', msg.author.id);
			const reqLevel = craftingItem.levelReq;

			// Check user has sufficient level/exp.
			if (reqLevel > crafterLevel) {
				// TODO: Add emoji
				const lackLevelText = `<@${userID}> lacks level ${reqLevel} crafting required to make ${itemCode}`;
				return COOP.MESSAGES.silentSelfDestruct(msg, lackLevelText, 0, 5000);
			}

			// Check for ingredients and multiply quantities.
			const canCraft = await CraftingHelper.canFulfilIngredients(msg.author.id, itemCode, qty);
			
			// TODO: Improve this error.
			if (!canCraft) return COOP.MESSAGES.silentSelfDestruct(msg, `Insufficient crafting supplies.`, 0, 7500);

			// Attempt to craft the object.
			const craftResult = await CraftingHelper.craft(msg.author.id, itemCode, qty);
			if (craftResult) {
				const addText = `<@${userID}> crafted ${itemCode}x${qty}.`;
				// COOP.CHANNELS.propagate(msg, addText, 'ACTIONS');

				COOP.CHANNELS.silentPropagate(msg, addText, 'ACTIONS');

			} else {
				COOP.MESSAGES.silentSelfDestruct(msg, `<@${userID}> failed to craft ${qty}x${itemCode}...`, 0, 15000);
			}

		} catch(e) {
			console.log('Error crafting item.');
			console.error(e);
		}
    }
    
}