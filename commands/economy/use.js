import FlareHandler from '../../operations/minigames/medium/economy/items/handlers/flareHandler';
import LaxativeHandler from '../../operations/minigames/medium/economy/items/handlers/laxativeHandler';
import ShieldHandler from '../../operations/minigames/medium/economy/items/handlers/shieldHandler';
import RPGHandler from '../../operations/minigames/medium/economy/items/handlers/rpgHandler';
import EasterEggHandler from '../../operations/minigames/medium/economy/items/handlers/easterEggHandler';

import { itemCodeArg, itemQtyArg, validItemQtyArgFloatGuard, usableItemCodeGuard } from '../../operations/minigames/medium/economy/itemCmdGuards';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE } from '../../origin/coop';
import GoldCoinHandler from '../../operations/minigames/medium/economy/items/handlers/goldCoinHandler';
import MineHandler from '../../operations/minigames/medium/economy/items/handlers/mineHandler';
import DefuseKitHandler from '../../operations/minigames/medium/economy/items/handlers/defuseKitHandler';


export default class UseCommand extends CoopCommand {

	constructor(client) {

		super(client, {
			name: 'use',
			group: 'economy',
			memberName: 'use',
			aliases: [
				'u', 
				// All all usable itemCodes as aliases too
				...USABLE.getUsableItems().map(code => code.toLowerCase())
			],
			description: 'This command lets you use the items you own',
			details: `Details of the use command`,
			examples: ['use', '!use laxative'],
			args: [itemCodeArg, itemQtyArg],
		});
	}

	async run(msg, { itemCode, qty }) {
		super.run(msg);

		// Guard to a proper float input.
		qty = parseFloat(qty);
		
		if (!validItemQtyArgFloatGuard(msg, msg.author, qty))
			return null;

		// Interpret item code from text/string/emoji/item_code.
		itemCode = COOP.ITEMS.interpretItemCodeArg(itemCode);

		// Usable item guard
		if (!usableItemCodeGuard(msg, itemCode, msg.author.username))
			return null;

		// Item is usable, therefore use it.
		if (itemCode === 'LAXATIVE') LaxativeHandler.use(msg, msg.author);
		if (itemCode === 'FLARE') FlareHandler.use(msg, msg.author);
		if (itemCode === 'SHIELD') ShieldHandler.use(msg);

		
		if (itemCode === 'RPG') RPGHandler.use(msg); // TODO: WIP
		if (itemCode === 'EASTER_EGG') EasterEggHandler.use(msg, msg.author); // TODO: WIP
		if (itemCode === 'GOLD_COIN') GoldCoinHandler.use(msg, msg.author); // TODO: WIP
		if (itemCode === 'MINE') MineHandler.use(msg, msg.author);
		if (itemCode === 'DEFUSE_KIT') DefuseKitHandler.use(msg, msg.author);
    }
    
}