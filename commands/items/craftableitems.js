import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';
import CraftingHelper from '../../operations/minigames/medium/skills/crafting/craftingHelper.js'

export default class CraftableItemsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'craftableitems',
			group: 'items',
			memberName: 'craftableitems',
			aliases: [],
			description: 'Check craftable items',
			details: `details`,
			examples: ['craftableitems']
		});
	}

	async run(msg) {
		super.run(msg);
        // Store user craftables in array to display them later.
        let userCraftables = [];
        // Loop though array of craftables and check if user can craft them.
        let craftables = Object.keys(CraftingHelper.CRAFTABLES);
        craftables.map((craftable) => {
           if(canFulfilIngredients(msg.author.id, craftable, 1)) {
               userCraftables.push(craftable);
           }
        });

        const msgText = `Your craftable items are: ${userCraftables.join(', ')}`;
        COOP.MESSAGES.selfDestruct(msg, msgText);
    }
    
}