import FlareHandler from '../../community/features/items/handlers/flareHandler';
import LaxativeHandler from '../../community/features/items/handlers/laxativeHandler';
import ItemsHelper from '../../community/features/items/itemsHelper';
import GiftboxHandler from '../../community/features/items/handlers/giftboxHandler';
import CoopCommand from '../../core/entities/coopCommand';
import ShieldHandler from '../../community/features/items/handlers/shieldHandler';
import RPGHandler from '../../community/features/items/handlers/rpgHandler';
import { itemCodeArg, itemQtyArg, ownEnoughGuard, usableItemCodeGuard } from '../../core/entities/commands/guards/itemCmdGuards';


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

		// Rely on is usable item guard and its feedback/error message.
		const isUsable = usableItemCodeGuard(msg, itemCode, msg.author.username);
		if (!isUsable) return false;

		// Rely on own enough item qty guard and its feedback/error message.
		const ownEnough = await ownEnoughGuard(msg.author, msg, itemCode, qty);
		if (!ownEnough) return false;

		// TODO: Assume that it will be used before .use() is fired and consume here and now via guard?

		// TODO: ADD QTY TO THESE HANDLERS?
		
		// Item is usable, therefore use it.
		if (itemCode === 'LAXATIVE') LaxativeHandler.use(msg, msg.author);
		if (itemCode === 'FLARE') FlareHandler.use(msg, msg.author);
		if (itemCode === 'EMPTY_GIFTBOX') GiftboxHandler.use(msg);
		if (itemCode === 'SHIELD') ShieldHandler.use(msg);
		if (itemCode === 'RPG') RPGHandler.use(msg); // TODO: WIP
    }
    
};