import CoopCommand from '../../operations/activity/messages/coopCommand';
import BaseHelper from '../../operations/minigames/medium/conquest/baseHelper';

import { MESSAGES, USERS } from '../../origin/coop';

export default class AllBasesCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'allbases',
			group: 'conquest',
			memberName: 'allbases',
			description: 'allbases',
			examples: ['!allbases']
		});
	}

	async run(msg) {
		super.run(msg);

		const bases = await BaseHelper.all();
		const baseMsgText = `**Bases Overview (${bases.length}) [Tile|Owner|Age]:**\n` +
			bases.map(base => 
				base.face_id + ' | ' + 
				USERS._id2username(base.owner_id) + ' | ' + 
				base.created_at
			).join('\n');

		MESSAGES.silentSelfDestruct(msg, baseMsgText);
    }
    
}