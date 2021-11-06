import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton } from "discord.js";

import { MESSAGES, ITEMS, TIME, CHANNELS } from '../../origin/coop.mjs';

import BlogHelper from '../../operations/marketing/blog/blogHelper.mjs';
import Database from '../../origin/setup/database.mjs';

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
	return interaction.reply('Post is work in progres.');
}