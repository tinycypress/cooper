
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import STATE from '../../core/state';


export default class KickCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'kick ',
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

        MessagesHelper.selfDestruct(msg, 'You are being kicked in 3...', 333);
        MessagesHelper.selfDestruct(msg, 'You are being kicked in 2...', 1333);
        MessagesHelper.selfDestruct(msg, 'You are being kicked in 1...', 2333);
        MessagesHelper.selfDestruct(msg, '!kick is a social construct.', 3333);
    }
    
};
