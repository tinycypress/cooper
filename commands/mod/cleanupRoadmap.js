 import CoopCommand from '../../operations/activity/messages/coopCommand';

import COOP, { STATE } from '../../origin/coop';

export default class CleanupRoadmapCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'cur',
			group: 'mod',
			memberName: 'cur',
			aliases: [],
			description: 'Information cur our fine community!',
			details: `Details`,
			examples: ['cur', 'cur example?'],

			// Stop us getting nuked
			ownerOnly: true,
		});
	}

	async run(msg) {
		super.run(msg);
		
		// Delete all messages with check marks inside roadmap
		const roadmap = COOP.CHANNELS._getCode('ROADMAP');

		const msgs = await roadmap.messages.fetch({ limit: 100 });
		const forRemoval = msgs.filter(msg => {
			let hasElectedTrashEmoji = false;
			// Check if it has check mark emoji on it.
			msg.reactions.cache.map(rct => {
				if (rct.emoji.name === '✅') hasElectedTrashEmoji = true;
			});

			// Add to map of messages for bulk deletion.
			if (hasElectedTrashEmoji) return true;
		});

		forRemoval.map(msg => msg.delete());
    }
    
}