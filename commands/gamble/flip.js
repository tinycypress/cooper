import CoopCommand from '../../operations/activity/messages/coopCommand';
import { authorConfirmationPrompt, firstConfirmPrompt } from '../../operations/common/ui';
import COOP, { MESSAGES, STATE } from '../../origin/coop';

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

		const userID = msg.author.id;

		// Confirm game start and amount
		const goldCoin = MESSAGES._displayEmojiCode('GOLD_COIN');
		const confirmMsg = await authorConfirmationPrompt(
			msg, 
			`<@${userID}>, you want to flip ${amount}x${goldCoin}?`,
			userID
		);

		// Check that the author of the command confirmed it.
		if (confirmMsg) {
			const joiner = await firstConfirmPrompt(confirmMsg, 'React to join this game!');
			if (joiner) {
				// MESSAGES.silentSelfDestruct(conf)
				msg.say('Someone joined coinflip! Still work in progress, please try again tomorrow.');
				console.log(joiner);
			}
		}

		// TODO: Take the gambling fee.

		// TODO: Challenge flip command may be needed
		// Ask for heads or tails.

		// Randomly generate result.
		// const result = STATE.CHANCE.coin();


		// Apply reward or subtraction.


		// Provide feedback with silent ping.
		// COOP.MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}> is testing flip. ${result}`);
    }
}
    