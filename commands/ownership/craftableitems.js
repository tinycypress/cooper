import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';
import CraftingHelper from '../../operations/minigames/medium/skills/crafting/craftingHelper';

export default class CraftableItemsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'craftableitems',
			group: 'ownership',
			memberName: 'craftableitems',
			aliases: ['craftables', 'craftitems', 'cancraft'],
			description: 'Displays a list of all the items the user can craft',
			details: `details`,
			examples: ['craftableitems']
		});
	}

	async run(msg) {
		super.run(msg);
        // Get array of usercraftable items.
        try {
            let userCraftables = await CraftingHelper.userCraftables(msg.author.id);
            // Say that user doesn't have any items to craft if the usercraftable array is empty.
            const msgText = userCraftables.length ? `Your craftable items are: ${userCraftables.join(', ')}` : 'There are no items that you can craft';
            COOP.MESSAGES.selfDestruct(msg, msgText);
        } catch(e) {
            console.log('An error ocurred while getting usercraftable items');
            console.error(e);
        }
    }

    
}