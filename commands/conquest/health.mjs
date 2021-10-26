import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import COOP from '../../origin/coop.mjs';

export default class HealthCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'health',
			group: 'conquest',
			memberName: 'health',
			aliases: ['h', 'hlt', 'hlth'],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `Details of the health command`,
			examples: ['health', 'an example of how coop-economics functions, trickle down, sunny side up Egg & Reaganonmics. Supply and demand.'],
			args: [
				{
					key: 'targetUser',
					prompt: 'Whose health are you trying to check?',
					type: 'user',
					default: ''
				}
			]
		});
	}

	async run(msg, { targetUser }) {
		super.run(msg);

		if (msg.mentions.users.first()) targetUser = msg.mentions.users.first();
		if (!targetUser) targetUser = msg.author;

        try {
			// Quick reference for the target name.
			const name = targetUser.username;

			// Load their health.
			const health = await COOP.USERS.getField(targetUser.id, 'health') || 100;

			// Return the health figure.
			COOP.MESSAGES.selfDestruct(msg, `${name}'s health is: ${health}.`);

        } catch(err) {
            console.error(err);
        }
    }
    
}
