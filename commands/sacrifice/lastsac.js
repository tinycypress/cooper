import SacrificeHelper from '../../operations/members/redemption/sacrificeHelper';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE, SERVER, TIME } from '../../origin/coop';


export default class LastSacrificeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'lastsac',
			group: 'sacrifice',
			memberName: 'lastsac',
			aliases: [],
			description: 'Check last election date',
			details: ``,
			examples: ['lastsac'],
			args: [
				{
					key: 'targetUser',
					prompt: 'Whose last sacrifice are you trying to check?',
					type: 'user',
					default: ''
				},
			]
		});
	}

	// Find the last sacrifice time of a user.
	async run(msg, { targetUser }) {
		super.run(msg);

		// Without any target
		if (targetUser === '') targetUser = msg.author;

		// Requires a valid user.
		if (!targetUser) 
			return COOP.MESSAGES.selfDestruct(msg, '!lastsac requires a valid user target to provide results.');

		// Default status for last sacrifice date.
		let lastSacrificeFmt = 'unknown';

		// Load and format last sacrifice time.
		const lastSacSecs = await SacrificeHelper.getLastSacrificeSecs(targetUser.id);
		if (lastSacSecs) lastSacrificeFmt = TIME.secsLongFmt(lastSacSecs);
		
		// Provide the result to the user.
		const msgText = `${targetUser.username}'s last sacrifice was: ${lastSacrificeFmt}.`;
		COOP.MESSAGES.selfDestruct(msg, msgText);
    }
    
}