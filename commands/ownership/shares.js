import CoopCommand from "../../operations/activity/messages/coopCommand";
import { usableItemCodeGuard } from "../../operations/minigames/medium/economy/itemCmdGuards";
import ItemsHelper from "../../operations/minigames/medium/economy/items/itemsHelper";
import { MESSAGES } from "../../origin/coop";

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
					prompt: 'Which item code do you want to check the shares % of? (Default: *)',
					default: "*"
				}
			]
		});
	}

	async run(msg, { itemCode }) {
		super.run(msg);

	
		// Output shares of all items
		if (itemCode === '*')
			return MESSAGES.selfDestruct(msg, 'Calculating shares of all items');
		
		const validItemCode = ItemsHelper.interpretItemCodeArg(itemCode);
		if (itemCode !== '*' && !usableItemCodeGuard(msg, validItemCode, msg.author))
			return null;

		// Output share of requested item (if valid)
		MESSAGES.selfDestruct(msg, `Calculating shares of ${validItemCode}`);
    }

    
}