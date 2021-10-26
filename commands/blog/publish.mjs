import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import { authorConfirmationPrompt } from '../../operations/common/ui.mjs';
import BlogHelper from '../../operations/marketing/blog/blogHelper.mjs';
import { MESSAGES } from '../../origin/coop.mjs';

export default class PostPublishCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'publish',
			group: 'blog',
			memberName: 'publish',
			description: 'Attempts to publish a blog post draft.',
			examples: ['!publish (from within draft post channel)', '!publish CHANNEL_ID'],
			args: [
				{
					key: 'channelID',
					prompt: 'Blog post draft\'s channel ID',
					type: 'string',
					default: ''
				}
			]
		});
	}

	// I think we should only let commander/leaders APPROVE posts but ALL MEMBERS allowed to submit.
	async run(msg, { channelID }) {
		super.run(msg);
        
		try {
			// Try to infer the draft channel ID from current channel.
			if (!channelID) channelID =	msg.channel.id;

			// If ID is null... try to see if the current one will work.
			const draft = await BlogHelper.loadDraftByChannelID(channelID);
			if (!draft)
				return MESSAGES.silentSelfDestruct(msg, 'Could not find blog post draft.');

			// Check user is the owner of the blog post draft.
			if (msg.author.id !== draft.owner_id)
				return MESSAGES.silentSelfDestruct(msg, 'You cannot manage that blog post draft.');

			const confirmMsg = await authorConfirmationPrompt(msg, 'Really publish ' + draft.title + '?', msg.author.id);
			if (!confirmMsg) return null;

			// Fulfil the draft.
			BlogHelper.fulfilDraft(draft);
			
		} catch(e) {
			console.log('Failed to publish blog post draft.');
			console.error
		}
    }
}

