import CoopCommand from '../../operations/activity/messages/coopCommand';
import { authorConfirmationPrompt, firstConfirmPrompt } from '../../operations/common/ui';
import { doesOwnDidUseGuard } from '../../operations/minigames/medium/economy/itemCmdGuards';
import COOP, { ITEMS, MESSAGES, STATE } from '../../origin/coop';

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

		// TODO: Check valid amount
		// amount = parseFloat(amount);
		// if (isNaN(amount)) 

		// Check if they have a gold coin
		// if (!await doesOwnDidUseGuard(msg.author, 'GOLD_COIN', amount, msg))
			// MESSAGES.silentSelfDestruct(msg, 'Does not enough gold coin but allowed for testing.')
			// return null;


		// Confirm game start and amount
		const goldCoin = MESSAGES._displayEmojiCode('GOLD_COIN');

		// Check that the author of the command confirmed it.
		const confirmText = `<@${userID}>, you want to flip ${amount}x${goldCoin}?`;
		const confirmMsg = await authorConfirmationPrompt(msg, confirmText, userID);
		if (!confirmMsg) return null;

		// Add to messages for faster cancel/cleanup.
		interactionMessages.push(confirmMsg);

		// Try to read the first non-Cooper user from the confirmation prompt.
		const firstReactor = await firstConfirmPrompt(msg, 'React to join this game!');
		if (!firstReactor) return null;

		// Check if reactor has coin qty, otherwise fail and refund game creator.
		// if (!await doesOwnDidUseGuard(firstReactor, GOLD_COIN, amount, msg)) {
			// Refund game creator
			// await ITEMS.add(userID, GOLD_COIN, amount)

			// MESSAGES.silentSelfDestruct(msg, 'Does not enough gold coin but allowed for testing.')

			// Cancel and clean up.
			// return null;
		// } 

		// Choose who gets to pick heads or tails
		const chooser = STATE.CHANCE.coin() === 'tails' ? msg.author : firstReactor;
		const nonchooser = chooser.id === firstReactor.id ? firstReactor : msg.author;

		const playText = `<@${firstReactor.id}> joined <@${userID}>'s coinflip! <@${chooser.id}> gets to choose, say h/t/heads/tails to play!`;
		const playMsg = await MESSAGES.silentSelfDestruct(msg, playText);

		// Await messages from chooser "h" "heads" or "t" "tails"
		const headsAliases = ['t', 'head', 'heads', 'hea', 'he', 'headss', 'headz'];
		const tailsAliases = ['t', 'tail', 'tails', 'tai', 'ta', 'tailss', 'tailz'];
		const coinOpts = [...headsAliases, ...tailsAliases];
		const coinflipMsgFilter = m => {
			const isChooser = m.author.id === chooser.id;
			const isValid = coinOpts.includes(m.content.toLowerCase());

			console.log(isChooser, isValid, m.content.toLowerCase())

			return isValid && isChooser;
		}

		// Collect the choice of the selected chooser.
		let sideChoice = null;
		const choiceCollected = await playMsg.channel.awaitMessages(
			coinflipMsgFilter, { max: 1, time: 30000 }
		);

		console.log(choiceCollected, choiceCollected.size);

		// Parse the side/landing choice:
		choiceCollected.map(choiceMsg => {
			const choiceMsgText = choiceMsg.content.toLowerCase();
			console.log('choice: ' + choiceMsgText);
			if (headsAliases.includes(choiceMsgText)) sideChoice = 'heads';
			if (tailsAliases.includes(choiceMsgText)) sideChoice = 'tails';
			console.log(sideChoice);
		});

		// Refund if invalid input/timeout.
		if (choiceCollected.size === 0 || !sideChoice) {
			const failErrorText = `Coinflip failed/expired, both players refunded.`;
			return MESSAGES.silentSelfDestruct(msg, failErrorText);
		}

		// Give reward
		const rewardAmount = 2 * amount;

		// Calculate winner, and loser.
		const winningRoll = STATE.CHANCE.coin()
		const winner = sideChoice === winningRoll ? chooser : nonchooser;
		const loser = sideChoice === winningRoll ? nonchooser : chooser;

		// Provide feedback with silent ping.
		const choiceText = `${goldCoin} coin lands on ${winningRoll}, you chose ${sideChoice}`;
		const resultText = `${choiceText}, <@${winner.id}> wins ${rewardAmount}x${goldCoin}, <@${loser.id}> loser.`;
		MESSAGES.silentSelfDestruct(msg, resultText);
    }
}
    