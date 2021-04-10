import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE, SERVER, TIME } from '../../origin/coop';


export default class DirectCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'direct',
			group: 'mod',
			memberName: 'direct',
			aliases: [],
			description: 'Information direct our fine community!',
			details: `Details`,
			examples: ['direct', 'direct example?'],
			args: [
				{
					key: 'target',
					prompt: 'Who do you want to dm?',
					type: 'user',
				},
				{
					key: 'message',
					prompt: 'What message would you like to send?',
					type: 'string',
				},
			],
			ownerOnly: true
		});
	}

	// TODO: Allow commander to use.
	async run(msg, { target, message }) {
		super.run(msg);

		try {

			await COOP.USERS.directMSG(SERVER._coop(), target.id, message);
		} catch (e) {
			console.error(e);
		}

	}

};