import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

export default class PirateCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'pirate',
			group: 'info',
			memberName: 'pirate',
			aliases: ['prt'],
			description: 'Information pirate our fine community!',
			details: `Details`,
			examples: ['pirate', 'pirate example?'],
		});
	}

	async run(msg) {
		super.run(msg);
		
		// Trim query and encode
		const searchStr = encodeURIComponent(
			msg.content
				.replace('!pirate ', '')
				.replace('!prt ', '')
		);

		// searchStr.replace('')
		
		// Generate feedback flash
		const linkMsg = await MessagesHelper.selfDestruct(msg, 'https://moviesjoy.to/search/' + searchStr, 0, 15000);
		MessagesHelper.delayReact(linkMsg, '🏴‍☠️', 333);
    }
    
};