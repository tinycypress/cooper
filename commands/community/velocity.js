import CoopCommand from '../../operations/activity/messages/coopCommand';

import COOP, { ITEMS } from '../../origin/coop';
import Statistics from '../../operations/activity/information/statistics';



export default class VelocityCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'velocity',
			group: 'community',
			memberName: 'velocity',
			aliases: ['vel'],
			description: 'Get the current velocity',
			examples: ['!velocity']
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			const roundedVel = ITEMS.displayQty(Statistics.calcCommunityVelocity());
			const velocityText = `Community velocity is ${roundedVel}.`

			COOP.MESSAGES.selfDestruct(msg, velocityText, 0, 20000);

		} catch(e) {
			console.error(e);
		}
    }
    
}