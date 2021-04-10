import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';

export default class GoogleCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'google',
			group: 'info',
			memberName: 'google',
			aliases: ['gg'],
			description: 'Information google our fine community!',
			details: `Details`,
			examples: ['google', 'google example?'],
		});
	}

	async run(msg) {
		super.run(msg);
		
		// Trim query and encode
		const searchStr = encodeURIComponent(
			msg.content
				.replace('!google ', '')
				.replace('!gg ', '')
		);

		// Generate feedback flash
		COOP.MESSAGES.selfDestruct(msg, 'https://www.google.com/search?q=' + searchStr);
    }
    
}