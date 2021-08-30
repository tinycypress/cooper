import CoopCommand from '../../operations/activity/messages/coopCommand';

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
			// Check link exists
			// Check author is command user
			// Update in database
			// Check author is a member
			

		} catch(e) {
			console.log('setintrolink failed.');
			console.error(e);
		}
    }
    
}


