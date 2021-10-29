import { SlashCommandBuilder } from "@discordjs/builders";

export const name = 'ticker';

export const description = 'Get stock ticker information';
    
export const data = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption(option => 
		option
			.setName('ticker')
			.setDescription('Stock ticker')
			.setRequired(true)
	)

export const execute = async (interaction) => {
	const ticker = interaction.options.get('ticker').value ?? '';
	return await interaction.reply(`Be patient, Doc. We\'ll tell you about ${ticker} soon!`)
};

