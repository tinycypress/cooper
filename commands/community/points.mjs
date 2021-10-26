import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import { ITEMS } from '../../origin/coop.mjs';

export default class PointsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'points',
			group: 'community',
			memberName: 'points',
			aliases: [],
			description: 'Displays points of user. Optional argument specifies the target user.',
			examples: ['!points <user>', '!points', '!points @DynamicSquid'],
		});
	}

	async run(msg) {
		super.run(msg);

		let targetUser = msg.author;
		if (msg.mentions.users.first())
			targetUser = msg.mentions.users.first();

        try {
			const points = await ITEMS.getUserItemQty(targetUser.id, 'COOP_POINT');
			await msg.channel.send(`${targetUser.username}'s points: ${ITEMS.displayQty(points)}`);

        } catch(err) {
            console.error(err);
        }
    }
    
}