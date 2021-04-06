import CoopCommand from '../../core/entities/coopCommand';

import ChannelsHelper from '../../core/entities/channels/channelsHelper';

import ItemsHelper from '../../community/features/items/itemsHelper';
import ElectionHelper from '../../community/features/hierarchy/election/electionHelper';

import { usableItemCodeGuard, useManyGuard, validUserArgGuard } from '../../core/entities/commands/guards/itemCmdGuards';


export default class GiveCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'give',
			group: 'economy',
			memberName: 'give',
			aliases: ['g'],
			description: 'This command lets you give the items you own',
			details: `Details of the give command`,
			examples: ['give', '!give laxative'],
			args: [
				{
					key: 'itemCode',
					prompt: 'What is the code of the item you wish to give? Use !items if not sure',
					type: 'string',
					default: null
				},
				{
					key: 'target',
					prompt: 'Who do you wish to give the item to? @ them.',
					type: 'user',
					default: null
				},
				{
					key: 'qty',
					prompt: 'How many of this item do you want to give?',
					type: 'integer',
					default: 1
				},
			],
		});
	}

	async run(msg, { itemCode, target, qty }) {
		super.run(msg);

		try {
			// Interpret, parse, and format item code.
			itemCode = ItemsHelper.interpretItemCodeArg(itemCode);

			// Configure item manifest for this item command.
			const itemManifest = {
				EMPTY_GIFTBOX: 1,
				[itemCode]: qty
			};

			// Check if this item code can be given.		
			const isUsableCode = usableItemCodeGuard(msg, itemCode, msg.author.username);
			console.log('isUsableCode', isUsableCode, msg.author.username);
			if (!isUsableCode) return null;

			// Attempt to load target just to check it can be given.
			const isValidUser = validUserArgGuard(msg, target, msg.author.username);
			console.log('isValidUser', isValidUser, msg.author.username);
			if (!isValidUser) return null;

			// Check the user has required gift items and giftbox.
			// Attempt to use item and only grant once returned successful, avoid double gift glitching.
			const itemsWereUsed = await useManyGuard(msg.author, msg, itemManifest);
			console.log('itemsWereUsed', itemsWereUsed, msg.author.username);
			if (itemsWereUsed) return null;

			// REVIEWS: Maybe a guard/check with an error is needed for item add too? :D

			// Add the item to the gift recepient.
			await ItemsHelper.add(target.id, itemCode, qty);
			
			// Intercept the giving of election items.
			if (itemCode === 'LEADERS_SWORD' || itemCode === 'ELECTION_CROWN')
				ElectionHelper.ensureItemSeriousness();

			// Send feedback message.
			// TODO: State how many both have now after gift.
			const addText = `${msg.author.username} gave ${target.username} ${itemCode}x${qty}.`;
			ChannelsHelper.propagate(msg, addText, 'FEED');

		} catch(e) {
			console.log('Failed to give item.');
			console.error(e);
		}
    }
    
};