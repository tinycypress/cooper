import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import { authorConfirmationPrompt, firstConfirmPrompt } from '../../operations/common/ui.mjs';
import { doesOwnDidUseGuard, validItemQtyArgFloatGuard } from '../../operations/minigames/medium/economy/itemCmdGuards.mjs';
import { ITEMS, MESSAGES, STATE } from '../../origin/coop.mjs';

export default class FlipCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'flip',
			group: 'gamble',
			memberName: 'flip',
			description: 'Information flip our fine community!',
			details: `Details`,
			examples: ['flip example?'],
			args: [
				{
					key: 'amount',
					prompt: 'How much gold coin you wanna gamble? Beak careful.',
					type: 'float',
					default: 0.1
				}
			]
		});
	}

	async run(msg, { amount }) {
		super.run(msg);

		const interactionMessages = [];

		const userID = msg.author.id;

		// Check valid amount
		const amountInput = amount;
		amount = parseFloat(amount);

		// Guard against bad/negative amounts.
		if (!validItemQtyArgFloatGuard(msg, msg.author, amount))
			return null;

		// Check input amount is valid or cancel and return error feedback.
		if (isNaN(amount))
			return MESSAGES.silentSelfDestruct(msg, `Coin flip betting amount value was invalid. (${amountInput})`);

		// Confirm game start and amount
		const goldCoin = MESSAGES.emojiCodeText('GOLD_COIN');

		// Check that the author of the command confirmed it.
		const confirmText = `<@${userID}>, you want to flip ${amount}x${goldCoin}?`;
		const confirmMsg = await authorConfirmationPrompt(msg, confirmText, userID);
		if (!confirmMsg) return null;

		// Check if they have a gold coin
		if (!await doesOwnDidUseGuard(msg.author, 'GOLD_COIN', amount, msg))
			return null;

		// Add to messages for faster cancel/cleanup.
		interactionMessages.push(confirmMsg);

		// Try to read the first non-Cooper user from the confirmation prompt.
		const joinText = `React to join a flip for ${amount}x${goldCoin}!`;
		const firstReactor = await firstConfirmPrompt(msg, joinText, msg.author.id);
		if (!firstReactor) {		
			const refundTotal = await ITEMS.add(msg.author.id, 'GOLD_COIN', amount, 'Flip no-join refund');
			const qtyText = ITEMS.displayQty(refundTotal);
			const refundText = `Nobody joined your coinflip :'(. Refunded ${amount}x${goldCoin} you now have ${qtyText}x${goldCoin}.`;
			return MESSAGES.silentSelfDestruct(msg, refundText);
		}

		// Check if reactor has coin qty, otherwise fail and refund game creator.
		if (!await doesOwnDidUseGuard(firstReactor, 'GOLD_COIN', amount, msg)) {
			// Refund game creator
			await ITEMS.add(userID, 'GOLD_COIN', amount, 'Insufficient joiner flip refund');

			// Clean up the other messages?

			// Cancel and clean up.
			// Give refund/failure message.

			return MESSAGES.silentSelfDestruct(msg, `Game joiner couldn't afford, <@${userID}> refunded ${amount}x${goldCoin}.`);
		} 

		// Choose who gets to pick heads or tails
		const chooserRoll = STATE.CHANCE.coin();
		let chooser = msg.author;
		let nonchooser = firstReactor;
		if (chooserRoll === 'tails')
			(chooser = firstReactor, nonchooser = msg.author);

		// Acknowledge the join and start the game!
		const playText = `<@${firstReactor.id}> joined <@${userID}>'s coinflip! <@${chooser.id}> gets to choose, say h/t/heads/tails to play!`;
		const playMsg = await MESSAGES.silentSelfDestruct(msg, playText);

		// Await messages from chooser "h" "heads" or "t" "tails"
		const headsAliases = ['h', 'head', 'heads', 'hea', 'he', 'headss', 'headz'];
		const tailsAliases = ['t', 'tail', 'tails', 'tai', 'ta', 'tailss', 'tailz'];
		const coinOpts = [...headsAliases, ...tailsAliases];
		const coinflipMsgFilter = m => {
			const isChooser = m.author.id === chooser.id;
			const isValid = coinOpts.includes(m.content.toLowerCase());
			return isValid && isChooser;
		}

		// Collect the choice of the selected chooser.
		let sideChoice = null;
		const choiceCollected = await playMsg.channel.awaitMessages(
			coinflipMsgFilter, { max: 1, time: 30000 }
		);

		// Parse the side/landing choice:
		choiceCollected.map(choiceMsg => {
			const choiceMsgText = choiceMsg.content.toLowerCase();
			if (headsAliases.includes(choiceMsgText)) sideChoice = 'heads';
			if (tailsAliases.includes(choiceMsgText)) sideChoice = 'tails';
		});

		// Refund if invalid input/timeout.
		if (choiceCollected.size === 0 || !sideChoice) {
			const failErrorText = `Coinflip failed/expired, <@${chooser.id}> and <@${nonchooser.id}> were refunded ${goldCoin}x${amount}.`;
			// TODO: Add the user's id too
			await ITEMS.add(chooser.id, 'GOLD_COIN', amount, 'Coin flip failed/expired refund');
			await ITEMS.add(nonchooser.id, 'GOLD_COIN', amount, 'Coin flip failed/expired refund');
			return MESSAGES.silentSelfDestruct(msg, failErrorText);
		}

		// Calculate winner, and loser.
		const winningRoll = STATE.CHANCE.coin()
		const winner = sideChoice === winningRoll ? chooser : nonchooser;
		const loser = sideChoice === winningRoll ? nonchooser : chooser;

		// Calculate and give reward.
		const rewardAmount = 2 * amount;

		const newTotal = await ITEMS.add(winner.id, 'GOLD_COIN', rewardAmount, 'Coin flip victory');
		const qtyText = ITEMS.displayQty(newTotal);

		// Provide feedback with silent ping.
		const choiceText = `${goldCoin} coin lands on ${winningRoll}, <@${chooser.id}> chose ${sideChoice}`;
		const resultText = `${choiceText}, <@${winner.id}> wins ${rewardAmount}x${goldCoin} and now has ${qtyText}x${goldCoin}, <@${loser.id}> loser.`;
		MESSAGES.silentSelfDestruct(msg, resultText);
    }
}
    