import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import COOP from '../../origin/coop.mjs';


export default class TotalMsgsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'totalmsgs',
			group: 'messages',
			memberName: 'totalmsgs',
			aliases: [],
			description: 'Check last message date',
			details: ``,
			examples: ['totalmsgs'],
			args: [
				{
					key: 'targetUser',
					prompt: 'Whose last message are you trying to check?',
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
			return COOP.MESSAGES.selfDestruct(msg, '!totalmsgs requires a valid user target to provide results.');

		// Default status for last sacrifice date.
		let totalMsgs = 'unknown';

		// Load and format last sacrifice time.
		const userTotal = await COOP.USERS.getField(targetUser.id, 'total_msgs');
		if (userTotal) totalMsgs = userTotal;
		
		// Provide the result to the user.
		const msgText = `${targetUser.username}'s total message count: ${totalMsgs}.`;
		COOP.MESSAGES.selfDestruct(msg, msgText);
    }
    
}