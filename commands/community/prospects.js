import CoopCommand from '../../operations/activity/messages/coopCommand';

import COOP, { ROLES, SERVER } from '../../origin/coop';
import { EMOJIS } from '../../origin/config';

export default class ProspectsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'prospects',
			group: 'community',
			memberName: 'prospects',
			description: 'Get the current prospects',
			examples: ['!prospects']
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			// Delete after sixty seconds.
			const prospects = ROLES._allWith('PROSPECT');
            const prospectText = `**Current Prospects:**\n` + 
				prospects.map(memb => memb.user.username).join(', ') + '.';

			COOP.MESSAGES.selfDestruct(msg, prospectText, 0, 20000);

		} catch(e) {
			console.error(e);
		}
    }
    
}