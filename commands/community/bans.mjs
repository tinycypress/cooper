import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';

import COOP, { SERVER } from '../../origin/coop.mjs';
import { EMOJIS } from '../../origin/config.mjs';

export default class BansCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'bans',
			group: 'community',
			memberName: 'bans',
			aliases: ['exbeaks', 'exuers', 'exmembers', 'bannedbeaks'],
			description: 'Get the current banned member count',
			examples: ['!bans'],
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			// Delete after sixty seconds.
            const emojiText = COOP.MESSAGES.emojiText(EMOJIS.COOP);
		
            const userCount = SERVER._coop().memberCount || 0;		
			const userBansNum = (await SERVER._coop().fetchBans()).size || 0;
            const countText = `${userBansNum} beaks (${Math.round(userCount / userBansNum * 100)}%) currently banned from The Coop ${emojiText}!`;
			COOP.MESSAGES.selfDestruct(msg, countText, 0, 20000);

		} catch(e) {
			console.error(e);
		}
    }
    
}