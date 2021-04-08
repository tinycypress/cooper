import FlareHandler from '../../community/features/items/handlers/flareHandler';
import LaxativeHandler from '../../community/features/items/handlers/laxativeHandler';
import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import ShieldHandler from '../../community/features/items/handlers/shieldHandler';
import RPGHandler from '../../community/features/items/handlers/rpgHandler';
import { itemCodeArg, itemQtyArg } from '../../core/entities/commands/guards/itemCmdGuards';
import EasterEggHandler from '../../community/features/items/handlers/easterEggHandler';


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
		itemCode = ItemsHelper.interpretItemCodeArg(itemCode);

		// Item is usable, therefore use it.
		if (itemCode === 'LAXATIVE') LaxativeHandler.use(msg, msg.author);
		if (itemCode === 'FLARE') FlareHandler.use(msg, msg.author);
		if (itemCode === 'SHIELD') ShieldHandler.use(msg);
		if (itemCode === 'RPG') RPGHandler.use(msg); // TODO: WIP
		if (itemCode === 'EASTER_EGG') EasterEggHandler.use(msg, msg.author); // TODO: WIP

				
    }
    
};