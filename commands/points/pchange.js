import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE, SERVER, TIME } from '../../origin/coop';

// Calculate the % point change historically for a user.
export default class PointChangeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'pchange',
			group: 'points',
			memberName: 'pchange',
			aliases: [],
			description: 'Information pchange our fine community!',
			details: `Details`,
			examples: ['pchange', 'pchange example?'],
		});
	}

	async run(msg) {
		super.run(msg);

		// Create an item that lets people try this and make it vote-guarded.

		// Compare historical_points increase % to current points for all members

        // historical_points
        // all points

		COOP.MESSAGESselfDestruct(msg, 'Calculating points change... :D Later.')
    }    
};