import { SlashCommandBuilder } from "@discordjs/builders";

export const name = 'lol';

export const description = 'The lol command!';
    
export const execute = async (interaction) => {
    console.log('lol executing');
    await interaction.reply('lol!');
};

export const data = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true));