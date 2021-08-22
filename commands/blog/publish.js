import CoopCommand from '../../operations/activity/messages/coopCommand';
import { MESSAGES } from '../../origin/coop';

export default class PostPreviewCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'publish',
			group: 'blog',
			memberName: 'publish',
			description: 'Attempts to publish a blog post draft.',
			examples: ['!publish', '!publish 1337'],
			args: [
				{
					key: 'id',
					prompt: 'Draft post ID',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { id }) {
		super.run(msg);
        
        // If ID is null... try to see if the current one will work.
        
		// I think we should only let commander/leaders APPROVE posts but ALL MEMBERS allowed to submit.
        // Check user is the owner of the blog post draft.
        
		// Calculate and return the content or send to a coop website preview link... better.

		MESSAGES.silentSelfDestruct(msg, 'Post preview is currently a work in progress.');
    }
}

