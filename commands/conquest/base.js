import CoopCommand from '../../operations/activity/messages/coopCommand';
import BaseHelper from '../../operations/minigames/medium/conquest/baseHelper';

import { MESSAGES, USERS } from '../../origin/coop';

export default class BaseCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'base',
			group: 'community',
			memberName: 'base',
			description: 'base a base/structure.',
			examples: ['base', 'base example'],
			args: [
				{
					key: 'baseID',
					type: 'string',
					prompt: 'Which id for the base?',
					default: ''
				}
			]
		});
	}

	async run(msg, { baseID }) {
		super.run(msg);
		
		const base = await BaseHelper.get(baseID);
		const owner = USERS._get(base.owner_id);
		const baseMsgText = `**Tile Details: #${base.face_id}:**\n` +
			`Owner: ${owner.username}\n` +
			`Age: ${base.created_at}`;
			
		MESSAGES.silentSelfDestruct(msg, baseMsgText);
    }
    
}