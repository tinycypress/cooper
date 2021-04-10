import EggHuntMinigame from '../../operations/minigames/small/egghunt';



import { itemCodeArg, usedOwnedUsableGuard } from '../../operations/minigames/medium/economy/itemCmdGuards';
import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { STATE, SERVER } from '../../origin/coop';
import { EMOJIS, RAW_EMOJIS } from '../../origin/config';

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
			itemCode = COOP.ITEMS.interpretItemCodeArg(itemCode);

			// Check item code is usable, was used, and valid with multi-guard.
			const used = await usedOwnedUsableGuard(msg.author, itemCode, 1, msg);
			if (!used) return null;

			// Drop the item based on its code.
			const emojiText = COOP.MESSAGES.emojiText(EMOJIS[itemCode]);
			const dropMsg = await msg.say(emojiText);

			// High chance of egg breaking if dropped.
			const eggDrop = EggHuntMinigame.isEgghuntDrop(emojiText);
			const breakRoll = STATE.CHANCE.bool({ likelihood: 45 });
			if (eggDrop && breakRoll) {
				// Change the message text to indicate breakage.
				COOP.MESSAGES.delayEdit(dropMsg, `${msg.author.username} broke ${emojiText} by dropping it, d'oh.`);

				// Clear the message.
				COOP.MESSAGES.delayDelete(dropMsg, 4444);
			}

			// TODO: Add to statistics.

			// Make it a temporary message to it gets cleaned up after an hour.
			SERVER.addTempMessage(dropMsg, 60 * 60);

			// Add indicative and suggestive icons, maybe refactor.
			COOP.MESSAGES.delayReact(dropMsg, RAW_EMOJIS.DROPPED, 333);
			COOP.MESSAGES.delayReact(dropMsg, EMOJIS.BASKET, 666);

			// Add success feedback message. (Could edit instead)
			const emoji = COOP.MESSAGES.emojiText(EMOJIS[itemCode]);
			const userDroppedText = `${msg.author.username} dropped ${itemCode} ${emoji}.`;
			COOP.MESSAGES.selfDestruct(dropMsg, userDroppedText, 0, 5000);
	
		} catch(e) {
			console.log('Error with drop command.');
			console.error(e);
		}

    }
    
};