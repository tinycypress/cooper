import CoopCommand from "../../operations/activity/messages/coopCommand";


export default class NukeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'nuke',
			group: 'mod',
			memberName: 'nuke',
			aliases: [],
			description: 'Information nuke our fine community!',
			details: `Details`,
			examples: ['nuke', 'nuke example?'],

			// Stop us getting nuked
			ownerOnly: true,
		});
	}

	async run(msg) {
		super.run(msg);
		
		// Bulk delete the messages.
		const messages = await msg.channel.messages.fetch({ limit: 50 });
		await msg.channel.bulkDelete(messages);

		await msg.reply('☢☢☢☢☢☢☢ing channel:: ' + msg.channel.name);
    }
    
};