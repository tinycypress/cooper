import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE, SERVER } from '../../origin/coop';

export default class ItemTotalCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'itemtotal',
			group: 'economy',
			memberName: 'itemtotal',
			aliases: ['it'],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `Details of the itemtotal command`,
			examples: ['itemtotal', 'an example of how coop-economics functions, trickle down, sunny side up Egg & Reaganonmics. Supply and demand.'],
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

		const total = await COOP.ITEMS.count(itemCode);

		const beaks = COOP.USERS.count(SERVER._coop(), false)
		const emoji = COOP.MESSAGES._displayEmojiCode(itemCode);
		
		return `**Economic circulation:**\n` +
			`${total}x${emoji} | _${(total / beaks).toFixed(2)} per beak_ | (${itemCode})`;
	}

	async run(msg, { itemCode }) {
		super.run(msg);


		// TODO: Also incorporate this into the guard... either a truthy item code interpreted or false, fail.
		const parsedItemCode = COOP.ITEMS.interpretItemCodeArg(itemCode);

		// TODO: Convert into invalid item code guard and REUSE FFS!!
		if (!USABLE.isUsable(parsedItemCode)) {
			const invalidText = `${itemCode} does not exist, please provide a valid item code.`;
			return COOP.MESSAGES.selfDestruct(msg, invalidText, 0, 5000);
		}


		const statText = await ItemTotalCommand.getStat(parsedItemCode);
		COOP.MESSAGES.selfDestruct(msg, statText, 333)
    }
    
};