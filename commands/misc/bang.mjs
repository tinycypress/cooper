import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import COOP from '../../origin/coop.mjs';

export default class BangCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'bang',
			group: 'misc',
			memberName: 'bang',
			aliases: [],
			description: 'Information bang our fine community!',
			details: `Details`,
			examples: ['bang', 'bang example?'],
		});
	}

	async run(msg) {
		super.run(msg);
		
		const placedMsg = await msg.say('🧨');

		COOP.MESSAGES.delayEdit(placedMsg, '🔥', 333);
		COOP.MESSAGES.delayEdit(placedMsg, '💥', 666);
		COOP.MESSAGES.delayEdit(placedMsg, '💨', 999);

		// Clear the message, animation completed.
		COOP.MESSAGES.delayDelete(placedMsg, 1666);
    }
    
}