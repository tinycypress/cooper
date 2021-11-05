import { SlashCommandBuilder } from "@discordjs/builders";

import { RAW_EMOJIS, EMOJIS } from '../../origin/config.mjs';
import { MESSAGES, ITEMS, TIME, USERS, CHANNELS } from '../../origin/coop.mjs';

import UsableItemHelper from '../../operations/minigames/medium/economy/items/usableItemHelper.mjs';
// import ProjectsHelper from '../../operations/productivity/projects/projectsHelper.mjs';

import { authorConfirmationPrompt } from '../../operations/common/ui.mjs';

export const name = 'post';

export const description = 'Post, preview or publish posts';
    
export const data = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)

	.addSubcommand(subcommand =>
		subcommand
			.setName('post')
			.setDescription('Democratically creates a community blog post.')
			.addStringOption(option => 
				option
					.setName('title')
					.setDescription('Post title?')
					.setRequired(true))
			.addStringOption(option => 
				option
					.setName('deadline')
					.setDescription('How long will the post take to write?')
					.setRequired(true))
	)
	
	// Preview subcommand
	.addSubcommand(subcommand =>
		subcommand
			.setName('preview')
			.setDescription('Preview publishing of channel.'))

	// Publish sub-command!
	.addSubcommand(subcommand =>
		subcommand
			.setName('publish')
			.setDescription('Publish this channel.'));

export const execute = async (interaction) => {

	console.log(interaction.isCommand());

	console.log(interaction.options.getSubcommand());

	// New post?
	// Preview?
	// Publish?

	return interaction.reply('Testing which sub command fired.');



	// Access the project title text.
	const title = interaction.options.get('title').value ?? '';
	const deadline = interaction.options.get('deadline').value ?? '';

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

	// End the authority of the slash command handler, offload to messages.
	interaction.reply('Awaiting confirmation.');

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
	
	// Indicate success.
	return true;
}