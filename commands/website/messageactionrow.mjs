import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton } from "discord.js";

export const name = 'messageactionrow';

export const description = 'Test the message action row';
    
export const data = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description);

export const execute = async (interaction) => {
    const row = new MessageActionRow()
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

    // Defer so we have longer to work/wait for response?
    interaction.deferReply();
    
    await interaction.reply({ content: 'Message action row!', components: [row] });

    const filter = i => !!i;

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
        await i.update({ content: 'A button was clicked!', components: [] });
    });

    collector.on('end', collected => console.log(`Collected ${collected.size} items`));
};


