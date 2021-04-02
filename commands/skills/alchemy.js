import DropTable from '../../community/features/items/droptable';
import ItemsHelper from '../../community/features/items/itemsHelper';
import UsableItemHelper from '../../community/features/items/usableItemHelper';
import ChannelsHelper from '../../core/entities/channels/channelsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

export default class AlchemyCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'alchemy',
			group: 'skills',
			memberName: 'alchemy',
			aliases: ['alc'],
			description: 'Alchemise various eggs, we\'re not yolking.',
			details: ``,
			examples: ['alchemy', '!alchemy 100 RARE_EGG'],
			args: [
				{
					key: 'itemCode',
					prompt: 'Which rarity? (item_code)',
					type: 'string',
					default: 'AVERAGE_EGG'
				},
				{
					key: 'qty',
					prompt: 'How many eggs?',
					type: 'integer',
					default: 100
				},
			],
		});
	}

	async run(msg, { qty, itemCode }) {
		super.run(msg);

		const alcQty = Math.round(parseInt(qty) / 100);

		if (!alcQty || alcQty < 1) 
			return MessagesHelper.selfDestruct(msg, 'At least 100 required.')

		let rarity = null;
		itemCode = ItemsHelper.parseFromStr(itemCode);
		if (itemCode === 'AVERAGE_EGG') rarity = 'AVERAGE';
		if (itemCode === 'RARE_EGG') rarity = 'RARE';
		if (itemCode === 'LEGENDARY_EGG') rarity = 'LEGENDARY';

		if (!rarity) 
			return MessagesHelper.selfDestruct(msg, 'Invalid item identifier.')

			
		// Calculate the alchemy reward.
		const drop = DropTable.getRandomTieredWithQty(rarity);
		const rewardQty = drop.qty * alcQty;

		// Take the ingredients from the user.
		const didUse = await UsableItemHelper.use(msg.author.id, itemCode, qty);
		if (!didUse)
			return MessagesHelper.selfDestruct(msg, 'Not enough eggs.')

		// Add item to the user.
		await ItemsHelper.add(msg.author.id, drop.item, rewardQty);

		// Present feedback text/msg.
		const emoji = MessagesHelper._displayEmojiCode(drop.item);
		const actionText = `${msg.author.username} alchemises ${emoji}`;
		const dropText = actionText + `x${rewardQty}`;

		return ChannelsHelper.propagate(msg, dropText, 'ACTIONS');
    }
    
};