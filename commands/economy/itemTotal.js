import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import ServerHelper from '../../core/entities/server/serverHelper';
import UsersHelper from '../../core/entities/users/usersHelper';

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

	static async getStat(itemCode) {
		if (!ItemsHelper.getUsableItems().includes(itemCode)) 
			return 'Invalid item code. ' + itemCode;

		const total = await ItemsHelper.count(itemCode);

		const beaks = UsersHelper.count(ServerHelper._coop(), false)
		const emoji = MessagesHelper._displayEmojiCode(itemCode);
		
		return `**Economic circulation:**\n` +
			`${total}x${emoji} | _${(total / beaks).toFixed(2)} per beak_ | (${itemCode})`;
	}

	async run(msg, { itemCode }) {
		super.run(msg);


		// TODO: Also incorporate this into the guard... either a truthy item code interpreted or false, fail.
		const parsedItemCode = ItemsHelper.interpretItemCodeArg(itemCode);

		// TODO: Convert into invalid item code guard and REUSE FFS!!
		if (!ItemsHelper.isUsable(parsedItemCode)) {
			const invalidText = `${itemCode} does not exist, please provide a valid item code.`;
			return MessagesHelper.selfDestruct(msg, invalidText, 0, 5000);
		}


		const statText = await ItemTotalCommand.getStat(parsedItemCode);
		MessagesHelper.selfDestruct(msg, statText, 333)
    }
    
};