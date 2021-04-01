import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

export default class SkillsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'skills',
			group: 'economy',
			memberName: 'skills',
			aliases: ['s'],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `Details of the skills command`,
			examples: ['skills', 'an example of how coop-economics functions, trickle down, sunny side up Egg & Reaganonmics. Supply and demand.'],
		});
	}

	async run(msg) {
		super.run(msg);


		return MessagesHelper.selfDestruct(msg, 'What should this command really do?');

		// let targetUser = msg.author;
		// if (msg.mentions.users.first()) targetUser = msg.mentions.users.first();

        // try {
		// 	const noItemsMsg = `${targetUser.username} does not own any items.`;
		// 	const items = await ItemsHelper.getUserItems(targetUser.id);
			
		// 	if (items.rows.length === 0) await msg.say(noItemsMsg);
		// 	else {
		// 		const itemDisplayMsg = ItemsHelper.formItemDropText(targetUser, items.rows);
		// 		await msg.say(itemDisplayMsg);
		// 	}

        // } catch(err) {
        //     console.error(err);
        // }
    }
    
};