import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import STATE from '../../core/state';

export default class FlipCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'flip',
			group: 'gamble',
			memberName: 'flip',
			aliases: [],
			description: 'Information flip our fine community!',
			details: `Details`,
			examples: ['flip example?'],
		});
	}

	async run(msg) {
		super.run(msg);


		// TODO: Take the gambling fee.

		// TODO: Challenge flip command may be needed
		// Ask for heads or tails.

		// Randomly generate result.
		const result = STATE.CHANCE.coin();


		// Apply reward or subtraction.


		// Provide feedback with silent ping.
		MessagesHelper.silentSelfDestruct(msg, `Testing flip. ${result}`);
    }
};
    