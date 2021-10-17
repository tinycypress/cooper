import CoopCommand from '../../operations/activity/messages/coopCommand';
import BlogHelper from '../../operations/marketing/blog/blogHelper';
import { MESSAGES } from '../../origin/coop';

export default class PostPreviewCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'postpreview',
			group: 'blog',
			memberName: 'postpreview',
			description: 'Preview the finished post version of a post channel. [The "result"].',
			examples: ['!postpreview [on blog post draft channel]', 'postpreview example?']
		});
	}

	async run(msg) {
		super.run(msg);

		const draft = await BlogHelper.loadDraftByChannelID(msg.channel.id);
		const previewLink = `https://thecoop.group/blog/draft/${msg.channel.id}`

		if (!draft)
			MESSAGES.silentSelfDestruct(msg, 'Must use !postpreview command on a post draft channel!');

		// Add content to the table so it shows up to date.
		MESSAGES.silentSelfDestruct(msg, `**${draft.title} preview: \n<${previewLink}>`);
    }
}

