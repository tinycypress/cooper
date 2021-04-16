import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';


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
				.replaceAll(' ', '-')
				.replace('!pirate ', '')
				.replace('!prt ', '')
		);

		// searchStr.replace('')
		
		// Generate feedback flash
		const linkMsg = await COOP.MESSAGES.selfDestruct(msg, 'https://moviesjoy.to/search/' + searchStr, 0, 15000);
		COOP.MESSAGES.delayReact(linkMsg, '🏴‍☠️', 333);
    }
    
}