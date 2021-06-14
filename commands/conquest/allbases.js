import CoopCommand from '../../operations/activity/messages/coopCommand';
import BaseHelper from '../../operations/minigames/medium/conquest/baseHelper';

import { MESSAGES } from '../../origin/coop';

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
		MESSAGES.silentSelfDestruct(msg, JSON.stringify(bases));
    }
    
}