 import CoopCommand from '../../operations/activity/messages/coopCommand';

export default class AboutCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'about',
			group: 'info',
			memberName: 'about',
			aliases: [],
			description: 'Information about our fine community!',
			details: `Details`,
			examples: ['about', 'about example?'],
		});
	}

	async run(msg) {
		super.run(msg);
		
		await msg.reply('Check the about channel, under welcome category!');
    }
    
};
