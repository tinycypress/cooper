import { SlashCommandBuilder } from "@discordjs/builders";

import { RAW_EMOJIS, EMOJIS } from '../../origin/config.mjs';
import { MESSAGES, ITEMS, TIME, USERS, CHANNELS } from '../../origin/coop.mjs';

import BlogHelper from '../../operations/marketing/blog/blogHelper.mjs';
import Database from '../../origin/setup/database.mjs';
import UsableItemHelper from '../../operations/minigames/medium/economy/items/usableItemHelper.mjs';

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
	const action = interaction.options.getSubcommand();
	if (action === 'post') return post(interaction);
	if (action === 'preview') return preview(interaction);
	if (action === 'publish') return publish(interaction);
}

const post = interaction => {
	// Access the project title text.
	const title = interaction.options.get('title').value ?? '';
	const deadline = interaction.options.get('deadline').value ?? '';

	// This command a lil slow?
	// interaction.deferReply();

	const createProjectText = '**Create !post?** Details:\n\n' +

		'Title: __' + title + '__\n' +
		'Writer: ' + `<@${interaction.user.id}>` + '\n' +
		'Deadline: ' + deadline + '\n' +
		'Price: ' + emoji + ' ' + price + ' _(0.01% avg coin qty a week)_\n\n';

	// Create the response actions.
	const actions = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('confirm')
                .setLabel('Confirm')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('cancel')
                .setLabel('Cancel')
                .setStyle('DANGER'),
        );

    return await interaction.reply({ content: createProjectText, components: [actions] });

	// Check deadline is valid.
	if (!TIME.isValidDeadline(deadline))
		return MESSAGES.selfDestruct(interaction.channel, `<@${interaction.user.id}>, ${deadline} is an invalid duration for a post deadline.`);

	// Calculate the price.
	const basePrice = await ITEMS.perBeakRelativePrice('GOLD_COIN', 0.05);
	const numWeeks = Math.max(1, TIME.weeksUntilStr(deadline));
	const price = basePrice * numWeeks;

	// Check the user can afford to pay the price!
	const userCoinQty = await ITEMS.getUserItemQty(interaction.user.id, 'GOLD_COIN');
	if (userCoinQty < price)
		return MESSAGES.selfDestruct(interaction.channel, `<@${interaction.user.id}>, you cannot afford the post price (${price}xGOLD_COIN).`);

	// Acknowledge 
	const emoji = MESSAGES.emojiCodeText('GOLD_COIN');
	const createProjectText = '**Create !post?** Details:\n\n' +

		'Title: __' + title + '__\n' +
		'Writer: ' + `<@${interaction.user.id}>` + '\n' +
		'Deadline: ' + deadline + '\n' +
		'Price: ' + emoji + ' ' + price + ' _(0.01% avg coin qty a week)_\n\n';

	// Create the response actions.
	const actions = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('confirm')
                .setLabel('Confirm')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('cancel')
                .setLabel('Cancel')
                .setStyle('DANGER'),
        );

    
    const wut = await interaction.reply({ content: createProjectText, components: [actions] });

    // Defer so we have longer to work/wait for response?
    // interaction.deferReply();

    const filter = i => !!i;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
    collector.on('collect', async i => {
        await i.update({ content: 'A button was clicked!', components: [] });
    });
    collector.on('end', collected => console.log(`Collected ${collected.size} items`));

	console.log(wut);
	await wut.followUp({ content: createProjectText, components: [actions] });
	// const confirmText = createProjectText + '_Please react with tick to propose the blog post\'s creation!_';

	// Use the confirmation from the coin flip feature! :D
	// const confirmMsg = await authorConfirmationPrompt(interaction.channel, confirmText, interaction.user.id);
	// if (!confirmMsg) return null;

	// Check the user did pay.
	// const didPay = await UsableItemHelper.use(interaction.user.id, 'GOLD_COIN', price, 'Proposing blog post');
	// if (!didPay) return MESSAGES.selfDestruct(interaction.channel, `Post proposal cancelled, payment failure.`);
	
	// Proceed to list the channel for approval.
	// MESSAGES.selfDestruct(interaction.channel, title + '\'s blog post channel is being voted on!');

	// Create the project in suggestions for democratic approval.
	// const postSuggestMsg = await CHANNELS._postToChannelCode('SUGGESTIONS', createProjectText);

	// Add reactions for people to use.
	// MESSAGES.delayReact(postSuggestMsg, EMOJIS.POLL_FOR, 333);
	// MESSAGES.delayReact(postSuggestMsg, EMOJIS.POLL_AGAINST, 666);

	// Add project marker.
	// MESSAGES.delayReact(postSuggestMsg, RAW_EMOJIS.POST, 999);
	
	// Send poll tracking link.
	// USERS._dm(interaction.user.id, 
	// 	title + '\'s project channel is being voted on:\n' + 
	// 	MESSAGES.link(postSuggestMsg)
	// );
	
	// Indicate success.
	return true;
}

const preview = interaction => {
	const draft = await BlogHelper.loadDraftByChannelID(interaction.channel.id);
	const previewLink = `https://thecoop.group/blog/preview?channel_id=${interaction.channel.id}`;

	if (!draft)
		MESSAGES.selfDestruct(interaction.channel, 'Try preview on a post draft channel!');

	// Add content to the table so it shows up to date.
	const chan = CHANNELS._get(draft.channel_id);
	const content = await BlogHelper.buildDraft(chan);

	await Database.query({
		name: "update-draft-content",
		text: `UPDATE post_drafts SET content = $1 WHERE channel_id = $2`,
		values: [content, draft.channel_id]
	});

	// Send the link
	MESSAGES.selfDestruct(interaction.channel, `**${draft.title}** preview: \n<${previewLink}>`);

	return interaction.reply('Preview is work in progres.');
}

const publish = interaction => {		
	try {
		// If ID is null... try to see if the current one will work.
		const draft = await BlogHelper.loadDraftByChannelID(interaction.channel.id);
		if (!draft)
			return MESSAGES.selfDestruct(interaction.channel, 'Please run command within a post channel.');

		// Check user is the owner of the blog post draft.
		if (interaction.user.id !== draft.owner_id)
			return MESSAGES.selfDestruct(interaction.channel, 'You cannot manage that blog post draft.');

		const confirmMsg = await authorConfirmationPrompt(interaction.channel, 'Really publish ' + draft.title + '?', interaction.user.id);
		if (!confirmMsg) return null;

		// Fulfil the draft.
		BlogHelper.fulfilDraft(draft);
		
	} catch(e) {
		console.log('Failed to publish blog post draft.');
		console.error
	}
}