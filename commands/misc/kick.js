import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { STATE } from '../../origin/coop';

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

        COOP.MESSAGESselfDestruct(msg, 'You are being kicked in 3...', 333);
        COOP.MESSAGESselfDestruct(msg, 'You are being kicked in 2...', 1333);
        COOP.MESSAGESselfDestruct(msg, 'You are being kicked in 1...', 2333);
        COOP.MESSAGESselfDestruct(msg, '!kick is a social construct.', 3333);
    }
    
};
