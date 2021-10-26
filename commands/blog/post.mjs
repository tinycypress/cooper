import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';
import { authorConfirmationPrompt } from '../../operations/common/ui.mjs';
import UsableItemHelper from '../../operations/minigames/medium/economy/items/usableItemHelper.mjs';
import { RAW_EMOJIS, EMOJIS } from '../../origin/config.mjs';
import { MESSAGES, ITEMS, TIME, USERS, CHANNELS } from '../../origin/coop.mjs';

export default class PostCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'post',
			group: 'blog',
			memberName: 'post',
			description: 'This command is used to suggest the creation of a community post with a deadline.',
			details: `Details`,
			examples: ['post', 'post example?'],
			args: [
				{
					key: 'title',
					prompt: 'Post title?',
					type: 'string'
				},
				{
					key: 'deadline',
					prompt: 'Post publish deadline future time? Ex. next Tuesday, 3pm Wednesday, in 30 minutes, in half a year... etc',
					type: 'string'
				},
			]
		});
	}

	async run(msg, { title, deadline }) {
		super.run(msg);

		// Check deadline is valid.
		if (!TIME.isValidDeadline(deadline))
			return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, ${deadline} is an invalid duration for a post deadline.`);

		// TODO: Check title is valid.
		// TODO: Check the project does not already exist.

		// Calculate the price.
		const basePrice = await ITEMS.perBeakRelativePrice('GOLD_COIN', 0.05);
		const numWeeks = Math.max(1, TIME.weeksUntilStr(deadline));
		const price = basePrice * numWeeks;

		// Acknowledge 
		const emoji = MESSAGES.emojiCodeText('GOLD_COIN');
		const createProjectText = '**Create !post?** Details:\n\n' +

			'Title: __' + title + '__\n' +
			'Writer: ' + `<@${msg.author.id}>` + '\n' +
			'Deadline: ' + deadline + '\n' +
			'Price: ' + emoji + ' ' + price + ' _(0.01% avg coin qty a week)_\n\n'

		
		const confirmText = createProjectText + '_Please react with tick to propose the blog post\'s creation!_';

		// Check the user can afford to pay the price!
		const userCoinQty = await ITEMS.getUserItemQty(msg.author.id, 'GOLD_COIN');
		if (userCoinQty < price)
			return MESSAGES.silentSelfDestruct(msg, `<@${msg.author.id}>, you cannot afford the post price (${price}xGOLD_COIN).`);

		// Use the confirmation from the coin flip feature! :D
		const confirmMsg = await authorConfirmationPrompt(msg, confirmText, msg.author.id);
		if (!confirmMsg) return null;

		// Check the user did pay.
		const didPay = await UsableItemHelper.use(msg.author.id, 'GOLD_COIN', price, 'Proposing blog post');
		if (!didPay) return MESSAGES.silentSelfDestruct(msg, `Post proposal cancelled, payment failure.`);
		
		// Proceed to list the channel for approval.
		MESSAGES.silentSelfDestruct(msg, title + '\'s blog post channel is being voted on!');

		// Create the project in suggestions for democratic approval.
		const postSuggestMsg = await CHANNELS._postToChannelCode('SUGGESTIONS', createProjectText);

		// Add reactions for people to use.
		MESSAGES.delayReact(postSuggestMsg, EMOJIS.POLL_FOR, 333);
		MESSAGES.delayReact(postSuggestMsg, EMOJIS.POLL_AGAINST, 666);

		// Add project marker.
		MESSAGES.delayReact(postSuggestMsg, RAW_EMOJIS.POST, 999);
		
		// Send poll tracking link.
		USERS._dm(msg.author.id, 
			title + '\'s project channel is being voted on:\n' + 
			MESSAGES.link(postSuggestMsg)
		);
    }
}

