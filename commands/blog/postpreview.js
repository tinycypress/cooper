import CoopCommand from '../../operations/activity/messages/coopCommand';
import DatabaseHelper from '../../operations/databaseHelper';
import BlogHelper from '../../operations/marketing/blog/blogHelper';
import { CHANNELS, MESSAGES } from '../../origin/coop';
import Database from '../../origin/setup/database';

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
		const chan = CHANNELS._get(draft.channel_id);
		const content = await BlogHelper.buildDraft(chan);

		console.log(content);

		await Database.query({
			name: "update-draft-content",
			text: `UPDATE post_drafts SET content = $1 WHERE channel_id = $2 VALUES($1, $2)`,
			values: [content, draft.channel_id]
		});

		// Send the link
		MESSAGES.silentSelfDestruct(msg, `**${draft.title}** preview: \n<${previewLink}>`);
    }
}

