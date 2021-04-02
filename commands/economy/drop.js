import CoopCommand from '../../core/entities/coopCommand';

import EMOJIS from '../../core/config/emojis.json';
import RAW_EMOJIS from '../../core/config/rawemojis.json';

import MessagesHelper from '../../core/entities/messages/messagesHelper';
import ServerHelper from '../../core/entities/server/serverHelper';
import ItemsHelper from '../../community/features/items/itemsHelper';
import EggHuntMinigame from '../../community/features/minigame/small/egghunt';

import STATE from '../../core/state';
import { didUseGuard, usableItemCodeGuard, itemCodeArg } from '../../core/entities/commands/guards/itemCmdGuards';

export default class DropCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'drop',
			group: 'economy',
			memberName: 'drop',
			aliases: ['d'],
			description: 'This command lets you drop the items you own',
			details: `Details of the drop command`,
			examples: ['drop', '!drop laxative'],
			args: [itemCodeArg],
		});
	}

	async run(msg, { itemCode }) {
		super.run(msg);

		try {
			itemCode = ItemsHelper.interpretItemCodeArg(itemCode);

			console.log('drop ' + itemCode);

			// Check item code is usable and valid with command guard.
			const isUsable = usableItemCodeGuard(msg, itemCode, msg.author.username);
			console.log('usable ' + itemCode, isUsable);
			if (!isUsable) return null;


			// Use a guard to ensure the item was used.
			const didUse = await didUseGuard(msg.author, itemCode, msg);
			console.log('didUse ' + itemCode, didUse);
			if (!didUse) return null;

			console.log('Using! ' + itemCode);

			// Drop the item based on its code.
			const emojiText = MessagesHelper.emojiText(EMOJIS[itemCode]);
			const dropMsg = await msg.say(emojiText);

			// High chance of egg breaking if dropped.
			const eggDrop = EggHuntMinigame.isEgghuntDrop(emojiText);
			const breakRoll = STATE.CHANCE.bool({ likelihood: 45 });
			if (eggDrop && breakRoll) {
				// Change the message text to indicate breakage.
				MessagesHelper.delayEdit(dropMsg, `${msg.author.username} broke ${emojiText} by dropping it, d'oh.`);

				// Clear the message.
				MessagesHelper.delayDelete(dropMsg, 4444);
			}

			// TODO: Add to statistics.

			// Make it a temporary message to it gets cleaned up after an hour.
			ServerHelper.addTempMessage(dropMsg, 60 * 60);

			// Add indicative and suggestive icons, maybe refactor.
			MessagesHelper.delayReact(dropMsg, RAW_EMOJIS.DROPPED, 333);
			MessagesHelper.delayReact(dropMsg, EMOJIS.BASKET, 666);

			// Add success feedback message. (Could edit instead)
			const emoji = MessagesHelper.emojiText(EMOJIS[itemCode]);
			const userDroppedText = `${msg.author.username} dropped ${itemCode} ${emoji}.`;
			MessagesHelper.selfDestruct(dropMsg, userDroppedText, 0, 5000);
	
		} catch(e) {
			console.log('Error with drop command.');
			console.error(e);
		}

    }
    
};