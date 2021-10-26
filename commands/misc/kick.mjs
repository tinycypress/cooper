import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import COOP from '../../origin/coop.mjs';

export default class KickCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'kick',
			group: 'misc',
			memberName: 'kick',
			aliases: [],
			description: '!kick  information is classified',
			details: `Details`,
			examples: ['kick    ', 'kick     example?'],
		});
	}

	async run(msg) {
        super.run(msg);

		// Restrict to shinoa if it gets abused.
		// 672165988527243306

        COOP.MESSAGES.selfDestruct(msg, 'You are being kicked in 3...', 333);
        COOP.MESSAGES.selfDestruct(msg, 'You are being kicked in 2...', 1333);
        COOP.MESSAGES.selfDestruct(msg, 'You are being kicked in 1...', 2333);
        COOP.MESSAGES.selfDestruct(msg, '!kick is a social construct.', 3333);
    }
    
}
