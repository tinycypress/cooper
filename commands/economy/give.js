import ElectionHelper from '../../operations/members/hierarchy/election/electionHelper';

import { usableItemCodeGuard, useManyGuard, validItemQtyArgFloatGuard, validUserArgGuard } from '../../operations/minigames/medium/economy/itemCmdGuards';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';



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
					key: 'target',
					prompt: 'Who do you wish to give the item to? @ them.',
					type: 'user',
					default: ''
				},
				{
					key: 'itemCode',
					prompt: 'What is the code of the item you wish to give? Use !items if not sure',
					type: 'string',
					default: ''
				},
				{
					key: 'qty',
					prompt: 'How many of this item do you want to give?',
					type: 'float',
					default: 1
				},
			],
		});
	}

	async run(msg, { itemCode, target, qty }) {
		super.run(msg);


		// TODO: Allow them to run this even if arguments aren't in the right order!


		try {
			// Interpret, parse, and format item code.
			itemCode = COOP.ITEMS.interpretItemCodeArg(itemCode);

			// If no item code found, attempt to infer one from the rest of the message.
			if (!itemCode) itemCode = COOP.ITEMS.interpretItemCodeArg(msg.content);

			// If no target given in correct order, attempt to infer from mentions
			if (!target && msg.mentions.users.first()) 
				target = msg.mentions.users.first();

			// Guard against bad qty input/haxxors. lol.
			if (!validItemQtyArgFloatGuard(msg, msg.author, qty))
				return null;

			// Configure item manifest for this item command.
			const itemManifest = {
				EMPTY_GIFTBOX: 1,
				[itemCode]: qty
			};

			// Check if this item code can be given.		
			const isUsableCode = usableItemCodeGuard(msg, itemCode, msg.author.username);
			if (!isUsableCode) return null;

			// Attempt to load target just to check it can be given.
			const isValidUser = validUserArgGuard(msg, target, msg.author.username);
			if (!isValidUser) return null;

			// Check the user has required gift items and giftbox.
			// Attempt to use item and only grant once returned successful, avoid double gift glitching.
			const itemsWereUsed = await useManyGuard(msg.author, msg, itemManifest);
			if (!itemsWereUsed) return null;

			// REVIEWS: Maybe a guard/check with an error is needed for item add too? :D

			// Add the item to the gift recepient.
			await COOP.ITEMS.add(target.id, itemCode, qty);

			// TODO: create .addManifest and let them have the giftbox too :D.
			// TODO: Make sure pickups are logged/recorded in a channel (drop too).
			
			// Intercept the giving of election items.
			if (itemCode === 'LEADERS_SWORD' || itemCode === 'ELECTION_CROWN')
				ElectionHelper.ensureItemSeriousness();

			// Send feedback message.
			// TODO: State how many both have now after gift.
			const addText = `${msg.author.username} gave ${target.username} ${itemCode}x${qty}.`;
			COOP.CHANNELS.propagate(msg, addText, 'FEED');

		} catch(e) {
			console.log('Failed to give item.');
			console.error(e);
		}
    }
    
}