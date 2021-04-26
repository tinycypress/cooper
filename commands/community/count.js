import CoopCommand from '../../operations/activity/messages/coopCommand';

import COOP, { SERVER } from '../../origin/coop';
import { EMOJIS } from '../../origin/config';

export default class CountCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'count',
			group: 'community',
			memberName: 'count',
			aliases: ['numusers', 'serversize', 'beaks'],
			description: 'Get the current member count',
			details: ``,
			examples: ['count', 'count example']
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			// Delete after sixty seconds.
            const emojiText = COOP.MESSAGES.emojiText(EMOJIS.COOP);
            const userCount = SERVER._coop().memberCount || 0;
            const countText = `${userCount} #beaks presently in The Coop ${emojiText}!`;
			COOP.MESSAGES.selfDestruct(msg, countText, 0, 20000);

		} catch(e) {
			console.error(e);
		}
    }
    
}