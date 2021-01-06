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
			examples: ['itemtotal', 'an example of how coop-econmics functions, trickle down, sunny side up Egg & Reagonmics. Supply and demand.'],
			args: [
				{
					key: 'itemCode',
					prompt: 'Give the item code/name you want to check.',
					type: 'string'
				},
			]
		});
	}

	async run(msg, { itemCode }) {
		super.run(msg);

		// Tryto format.
		itemCode = ItemsHelper.parseFromStr(itemCode);
		// if ()
		if (!ItemsHelper.getUsableItems().includes(itemCode))
			return msg.reply(`${itemCode} does not exist, please provide a valid item code.`);

		const total = await ItemsHelper.count(itemCode);

		
		const beaks = UsersHelper.count(ServerHelper._coop(), false)
		const feedbackMsg = await msg.say(
			`Economic circulation: ${total}x${itemCode} | ${(total / beaks).toFixed(2)} per beak`
		);
		MessagesHelper.delayDelete(feedbackMsg, 15000);
    }
    
};