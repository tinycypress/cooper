import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';


export default class MostPointsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'mostpoints',
			group: 'ownership',
			memberName: 'mostpoints',
			aliases: [],
			description: 'Check the user with the most points',
			details: ``,
			examples: ['mostpoints']
		});
	}

	// Find the last sacrifice time of a user.
	async run(msg) {
		super.run(msg);

		// Get user with the most items.
		const mostPoints = await COOP.POINTS.getHighest();

		const mostPointsUser = COOP.USERS._get(mostPoints.owner_id).user;

		// Provide the result to the user.
		const msgText = `${mostPointsUser.username} has the most points (${mostPoints.quantity}).`;
		COOP.MESSAGES.selfDestruct(msg, msgText);
    }
    
}