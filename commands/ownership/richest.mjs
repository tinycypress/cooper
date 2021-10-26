import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import COOP from '../../origin/coop.mjs';

export default class RichestCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'richest',
			group: 'ownership',
			memberName: 'richest',
			aliases: [],
			description: 'Check last message date',
			details: ``,
			examples: ['richest']
		});
	}

	// Find the last sacrifice time of a user.
	async run(msg) {
		super.run(msg);

		// Get user with the most items.
		const mostItems = await COOP.ITEMS.getRichest();
		const mostItemsUser = COOP.USERS._get(mostItems.owner_id).user;

		// Provide the result to the user.
		const emoji = COOP.MESSAGES.emojiCodeText('GOLD_COIN');
		const msgText = `${mostItemsUser.username} is the richest member (${mostItems.total}x${emoji}).`;
		COOP.MESSAGES.selfDestruct(msg, msgText);
    }
    
}