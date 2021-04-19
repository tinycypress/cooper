import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';

export default class MostItemsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'mostitems',
			group: 'ownership',
			memberName: 'mostitems',
			aliases: [],
			description: 'Check last message date',
			details: ``,
			examples: ['mostitems']
		});
	}

	// Find the last sacrifice time of a user.
	async run(msg) {
		super.run(msg);

		// Get user with the most items.
		const mostItems = await COOP.ITEMS.getBiggestWhale();
		const mostItemsUser = COOP.USERS._get(mostItems.owner_id).user;

		// Provide the result to the user.
		const msgText = `${mostItemsUser.username} has the most items (${mostItems.total}).`;
		COOP.MESSAGES.selfDestruct(msg, msgText);
    }
    
}