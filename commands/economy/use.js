import FlareHandler from '../../operations/minigames/medium/economy/items/handlers/flareHandler';
import LaxativeHandler from '../../operations/minigames/medium/economy/items/handlers/laxativeHandler';
import ShieldHandler from '../../operations/minigames/medium/economy/items/handlers/shieldHandler';
import RPGHandler from '../../operations/minigames/medium/economy/items/handlers/rpgHandler';
import EasterEggHandler from '../../operations/minigames/medium/economy/items/handlers/easterEggHandler';

import { itemCodeArg, itemQtyArg } from '../../operations/minigames/medium/economy/itemCmdGuards';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE, SERVER } from '../../origin/coop';

export default class UseCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'use',
			group: 'economy',
			memberName: 'use',
			aliases: ['u'],
			description: 'This command lets you use the items you own',
			details: `Details of the use command`,
			examples: ['use', '!use laxative'],
			args: [itemCodeArg, itemQtyArg],
		});
	}

	async run(msg, { itemCode, qty }) {
		super.run(msg);

		// Fix to 1 for now until further tested.
		qty = 1;

		// Interpret item code from text/string/emoji/item_code.
		itemCode = COOP.ITEMS.interpretItemCodeArg(itemCode);

		// Item is usable, therefore use it.
		if (itemCode === 'LAXATIVE') LaxativeHandler.use(msg, msg.author);
		if (itemCode === 'FLARE') FlareHandler.use(msg, msg.author);
		if (itemCode === 'SHIELD') ShieldHandler.use(msg);
		if (itemCode === 'RPG') RPGHandler.use(msg); // TODO: WIP
		if (itemCode === 'EASTER_EGG') EasterEggHandler.use(msg, msg.author); // TODO: WIP
    }
    
};