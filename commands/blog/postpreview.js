import CoopCommand from '../../operations/activity/messages/coopCommand';
import { MESSAGES } from '../../origin/coop';

export default class PostPreviewCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'postpreview',
			group: 'blog',
			memberName: 'postpreview',
			description: 'Preview the finished post version of a post channel. [The "result"].',
			examples: ['postpreview', 'postpreview example?'],
			args: [
				{
					key: 'titleOrID',
					prompt: 'Post title/ID?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { titleOrID }) {
		super.run(msg);
		MESSAGES.silentSelfDestruct(msg, 'Post preview is currently a work in progress.');
    }
}

