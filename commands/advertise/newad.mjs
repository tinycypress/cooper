// import { RAW_EMOJIS, EMOJIS } from '../../origin/config';
// import { MESSAGES, ITEMS, TIME, USERS, CHANNELS } from '../../origin/coop';

// import UsableItemHelper from '../../operations/minigames/medium/economy/items/usableItemHelper';
// import ProjectsHelper from '../../operations/productivity/projects/projectsHelper';
// import { authorConfirmationPrompt } from '../../operations/common/ui';

import CoopCommand from '../../operations/activity/messages/coopCommand';

export default class NewAdCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'newad',
			group: 'advertise',
			memberName: 'newad',
			description: 'This command is used to suggest the creation of a community newad with a deadline.',
			details: `Details`,
			examples: ['newad', 'newad example?'],
			args: [
				{
					key: 'title',
					prompt: 'newad title?',
					type: 'string'
				},
				{
					key: 'deadline',
					prompt: 'newad deadline future time? Ex. next Tuesday, 3pm Wednesday, in 30 minutes, in half a year... etc',
					type: 'string'
				},
			]
		});
	}

	async run(msg, { title, deadline }) {
		super.run(msg);

		// // Check deadline is valid.
		// if (!TIME.isValidDeadline(deadline))
		// 	return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, ${deadline} is an invalid duration for a project deadline.`);

		// // TODO: Check title is valid.
		// // TODO: Check the project does not already exist.

		// // Calculate the price.
		// const basePrice = await ITEMS.perBeakRelativePrice('GOLD_COIN', 0.05);
		// const numWeeks = Math.max(1, TIME.weeksUntilStr(deadline));
		// const price = basePrice * numWeeks;

		// // Acknowledge 
		// const emoji = MESSAGES.emojiCodeText('GOLD_COIN');
		// const createProjectText = '**Create !project?** Details:\n\n' +

		// 	'Title: __' + title + '__\n' +
		// 	'Owner: ' + `<@${msg.author.id}>` + '\n' +
		// 	'Deadline: ' + deadline + '\n' +
		// 	'Price: ' + emoji + ' ' + price + ' _(0.01% avg coin qty a week)_\n\n'


		// const confirmText = createProjectText + '_Please react with tick to propose the project\'s creation!_';

		// // Check the user can afford to pay the price!
		// const userCoinQty = await ITEMS.getUserItemQty(msg.author.id, 'GOLD_COIN');
		// if (userCoinQty < price)
		// 	return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, you cannot afford the project price (${price}xGOLD_COIN).`);

		// // Use the confirmation from the coin flip feature! :D
		// const confirmMsg = await authorConfirmationPrompt(msg, confirmText, msg.author.id);
		// if (!confirmMsg) return null;

		// // Check the user did pay.
		// const didPay = await UsableItemHelper.use(msg.author.id, 'GOLD_COIN', price, 'Proposing project');
		// if (!didPay) return MESSAGES.silentSelfDestruct(msg, `Project proposal cancelled, payment failure.`);
		
		// // Proceed to list the channel for approval.
		// MESSAGES.silentSelfDestruct(msg, title + '\'s project channel is being voted on!');

		// // Create the project in suggestions for democratic approval.
		// const projectSuggestionMsg = await CHANNELS._postToChannelCode('SUGGESTIONS', createProjectText);

		// // Add reactions for people to use.
		// MESSAGES.delayReact(projectSuggestionMsg, EMOJIS.POLL_FOR, 333);
		// MESSAGES.delayReact(projectSuggestionMsg, EMOJIS.POLL_AGAINST, 666);

		// // Add project marker.
		// MESSAGES.delayReact(projectSuggestionMsg, RAW_EMOJIS.PROJECT, 999);
		
		// // Send poll tracking link.
		// USERS._dm(msg.author.id, 
		// 	title + '\'s project channel is being voted on:\n' + 
		// 	MESSAGES.link(projectSuggestionMsg)
		// );
    }
}

