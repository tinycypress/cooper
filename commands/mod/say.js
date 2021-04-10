 import CoopCommand from '../../operations/activity/messages/coopCommand';


export default class SayCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'say',
			group: 'mod',
			memberName: 'say',
			aliases: [],
			description: 'Information say our fine community!',
			details: `Details`,
			examples: ['say', 'say example?'],

			// Stop us getting nuked
			ownerOnly: true,
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			// const guild = ServerHelper.getByCode(STATE.CLIENT, 'PROD');

			const statement = msg.content.replace('!say ', '');
			await msg.say(statement)

			// if (channelParam) {
			// 	const channel = COOP.CHANNELS.getByCode(guild, channelReq);
			// 	await channel.say(statement);
			// }

		} catch(e) {
			console.error(e);
		}

    }
    
};