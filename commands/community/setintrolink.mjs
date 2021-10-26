import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import { MESSAGES, TIME, USERS } from '../../origin/coop.mjs';

export default class SetIntroLinkCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'setintrolink',
			group: 'community',
			memberName: 'setintrolink',
			description: 'Sets the intro link and content for a user.',
			examples: ['!setintrolink LMF https://disc...'],
			args: [
				{
					key: 'user',
					type: 'user',
					prompt: 'User the intro belongs to:'
				},
				{
					key: 'link',
					type: 'string',
					prompt: 'Link to your intro message:'
				}
			]
		});
	}

	async run(msg, { user, link }) {
		super.run(msg);

		try {
			// Check link is valid
			const introMsg = await MESSAGES.getByLink(link);
			if (!introMsg) 
				return MESSAGES.silentSelfDestruct(msg, 'Intro link does not exist.', 0, 5000);

			// Check author is command user
			if (introMsg.author.id !== user.id) 
				return MESSAGES.silentSelfDestruct(msg, 'Intro link does not belong to that user.', 0, 5000);

			// Update in database
			if (introMsg.content)
				USERS.setIntro(user.id, introMsg.content, link, introMsg.createdTimestamp);

			// Indicate success.
			MESSAGES.silentSelfDestruct(msg, 'Intro link and content were updated for ' + user.username, 0, 10000);

		} catch(e) {
			console.log('setintrolink failed.');
			console.error(e);
		}
    }
    
}


