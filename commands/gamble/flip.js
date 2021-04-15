import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { STATE } from '../../origin/coop';

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

	async run(msg) {
		super.run(msg);


		// 


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
    