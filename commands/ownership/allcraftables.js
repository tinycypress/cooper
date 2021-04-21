import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';
import CraftingHelper from '../../operations/minigames/medium/skills/crafting/craftingHelper';

export default class AllCraftablesCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'allcraftables',
			group: 'ownership',
			memberName: 'allcraftables',
			aliases: ['allcraftableitems'],
			description: 'Displays a list list of all the items that can be crafted',
			details: `details`,
			examples: ['allcraftables']
		});
	}

	async run(msg) {
		super.run(msg);
        try {
            // Get array of all craftable items.
            let craftables = await CraftingHelper.allCraftables();
            const msgText =  `List of all craftable items: ${craftables.join(', ')}`;
            COOP.MESSAGES.selfDestruct(msg, msgText);
        } catch(e) {
            console.log('An error ocurred while getting all craftable items');
            console.error(e);
        }
    }

    
}








