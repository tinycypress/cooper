import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE, SERVER, TIME } from '../../origin/coop';

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

		COOP.MESSAGESdelayEdit(placedMsg, '🔥', 333);
		COOP.MESSAGESdelayEdit(placedMsg, '💥', 666);
		COOP.MESSAGESdelayEdit(placedMsg, '💨', 999);

		// Clear the message, animation completed.
		COOP.MESSAGESdelayDelete(placedMsg, 1666);
    }
    
};