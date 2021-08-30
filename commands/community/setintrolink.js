import CoopCommand from '../../operations/activity/messages/coopCommand';
import { MESSAGES } from '../../origin/coop';

export default class SetIntroLinkCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'setintrolink',
			group: 'community',
			memberName: 'setintrolink',
			description: 'setintrolink a user.',
			examples: ['!setintrolink https://disc...'],
			args: [
				{
					key: 'link',
					type: 'string',
					prompt: 'Link to your intro message'
				}
			]
		});
	}

	async run(msg, { link }) {
		super.run(msg);

		try {
			// Check link is valid
			// Check link exists
			// Check author is command user
			// Update in database
			// Check author is a member
			MESSAGES.selfDestruct(msg, 'Work in progress...');

		} catch(e) {
			console.log('setintrolink failed.');
			console.error(e);
		}
    }
    
}


