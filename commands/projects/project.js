import CoopCommand from '../../operations/activity/messages/coopCommand';
import { authorConfirmationPrompt } from '../../operations/common/ui';
import UsableItemHelper from '../../operations/minigames/medium/economy/items/usableItemHelper';
import ProjectsHelper from '../../operations/productivity/projects/projectsHelper';
import { RAW_EMOJIS, EMOJIS } from '../../origin/config';
import { MESSAGES, ITEMS, TIME, USERS, CHANNELS } from '../../origin/coop';

export default class ProjectCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'project',
			group: 'projects',
			memberName: 'project',
			description: 'This command is used to suggest the creation of a community project with a deadline.',
			details: `Details`,
			examples: ['project', 'project example?'],
			args: [
				{
					key: 'title',
					prompt: 'Project title?',
					type: 'string'
				},
				{
					key: 'deadline',
					prompt: 'Project deadline future time? Ex. next Tuesday, 3pm Wednesday, in 30 minutes, in half a year... etc',
					type: 'string'
				},
			]
		});
	}

	async run(msg, { title, deadline }) {
		super.run(msg);

		// Check deadline is valid.
		if (!ProjectsHelper.isValidDeadline(deadline))
			return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, ${deadline} is an invalid duration for a project deadline.`);

		// TODO: Check title is valid.
		// TODO: Check the project does not already exist.

		// Calculate the price.
		const basePrice = await ITEMS.perBeakRelativePrice('GOLD_COIN', 0.05);
		const numWeeks = Math.max(1, TIME.weeksUntilStr(deadline));
		const price = basePrice * numWeeks;

		// Acknowledge 
		const createProjectText = '**Create !project?** Details:\n\n' +

			'Title: ' + title + '\n' +
			'Owner: ' + msg.author.username + '\n' +
			'Deadline: ' + deadline + '\n' +
			'Price: ' + price + '(0.01% avg coin qty a week)\n\n'

		const confirmText = createProjectText + '_Please react with tick to propose the project\'s creation!_';

		// Check the user can afford to pay the price!
		const userCoinQty = await ITEMS.getUserItemQty(msg.author.id, 'GOLD_COIN');
		if (userCoinQty < price)
			return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, you cannot afford the project price (${price}xGOLD_COIN).`);

		// Use the confirmation from the coin flip feature! :D
		const confirmMsg = await authorConfirmationPrompt(msg, confirmText, msg.author.id);
		if (!confirmMsg) return false;

		// Check the user did pay.
		const didPay = await UsableItemHelper.use(msg.author.id, 'GOLD_COIN', price);
		if (!didPay) return MESSAGES.silentSelfDestruct(msg, `Project proposal cancelled, payment failure.`);
		
		// Proceed to list the channel for approval.
		MESSAGES.silentSelfDestruct(msg, title + '\'s project channel is being voted on!');

		// Create the project in suggestions for democratic approval.
		const projectSuggestionMsg = await CHANNELS._postToChannelCode('SUGGESTIONS', createProjectText);

		// Add reactions for people to use.
		MESSAGES.delayReact(projectSuggestionMsg, EMOJIS.POLL_FOR, 333);
		MESSAGES.delayReact(projectSuggestionMsg, EMOJIS.POLL_AGAINST, 666);

		// Add project marker.
		MESSAGES.delayReact(projectSuggestionMsg, RAW_EMOJIS.PROJECT, 999);
		
		// Send poll tracking link.
		USERS._dm(msg.author.id, 
			title + '\'s project channel is being voted on!' + 
			MESSAGES.link(projectSuggestionMsg)
		);
    }
}

