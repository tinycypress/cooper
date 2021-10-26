import { SlashCommandBuilder } from "@discordjs/builders";

export const name = 'ping';

export const description = 'The ping command!';
    
export const execute = async (interaction) => {
    console.log('Ping executing');
    await interaction.reply('Pong!');
};

export const data = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true));