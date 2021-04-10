import CoopCommand from '../../operations/activity/messages/coopCommand';

export default class RolesCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'roles',
			group: 'community',
			memberName: 'roles',
			aliases: [],
			description: 'Information roles our fine community!',
			details: `Details`,
			examples: ['roles', 'roles example?'],
		});
	}

	async run(msg) {
		super.run(msg);
		
		msg.say('ROLES')
    }
}