import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';

export default class PointsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'points',
			group: 'community',
			memberName: 'points',
			aliases: [],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `Details of the points command`,
			examples: ['points', 'an example of how coop-economics functions, trickle down, sunny side up Egg & Reaganonmics. Supply and demand.'],
		});
	}

	async run(msg) {
		super.run(msg);

		let targetUser = msg.author;
		if (msg.mentions.users.first()) targetUser = msg.mentions.users.first();

        try {
			const points = await COOP.ITEMS.getUserItemQty(targetUser.id, 'COOP_POINT');
			await msg.channel.send(`${targetUser.username}'s points: ${points}`);

        } catch(err) {
            console.error(err);
        }
    }
    
}