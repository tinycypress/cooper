import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE, SERVER, ITEMS } from '../../origin/coop';

export default class ItemTotalCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'itemtotal',
			group: 'economy',
			memberName: 'itemtotal',
			aliases: ['it'],
			description: 'Displays the amount of an item that is currently in the economy, and the average number of items a person has.',
			examples: ['!itemtotal <item>', '!itemtotal wood'],
			args: [
				{
					key: 'itemCode',
					prompt: 'Give the item code/name you want to check.',
					type: 'string'
				},
			]
		});
	}

	// TODO: Refactor, belongs somewhere else.
	static async getStat(itemCode) {
		if (!USABLE.getUsableItems().includes(itemCode)) 
			return 'Invalid item code. ' + itemCode;

		const total = await ITEMS.count(itemCode);
		const totalFmt = ITEMS.displayQty(total);

		const beaks = COOP.USERS.count(SERVER._coop(), false)
		const emoji = COOP.MESSAGES.emojiCodeText(itemCode);

		const avg = (total / beaks).toFixed(2);
		
		return `**Economic circulation:**\n` +
			`${totalFmt}x${emoji} | _${avg} per beak_ | (${itemCode})`;
	}

	async run(msg, { itemCode }) {
		super.run(msg);


		// TODO: Also incorporate this into the guard... either a truthy item code interpreted or false, fail.
		const parsedItemCode = ITEMS.interpretItemCodeArg(itemCode);

		// TODO: Convert into invalid item code guard and REUSE FFS!!
		if (!USABLE.isUsable(parsedItemCode)) {
			const invalidText = `${itemCode} does not exist, please provide a valid item code.`;
			return COOP.MESSAGES.selfDestruct(msg, invalidText, 0, 5000);
		}


		const statText = await ItemTotalCommand.getStat(parsedItemCode);
		COOP.MESSAGES.selfDestruct(msg, statText, 333)
    }
    
}