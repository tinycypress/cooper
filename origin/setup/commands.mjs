import fs from 'fs';
import path from 'path';
import { Collection } from "discord.js";

export default async function setupCommands(client) {    
    // Start locally loading the commands.
    client.commands = new Collection();
    
    // Parse throuh the command files
    const commandsDir = path.resolve('./newcommands/');
    const commandFolders = fs.readdirSync(commandsDir,  { withFileTypes: true }).filter(de => de.isDirectory());
    commandFolders.map(async f => {
        const cmdFolderPath = commandsDir + '/' + f.name + '/';
        const commandFiles = fs.readdirSync(cmdFolderPath).filter(file => file.endsWith('.mjs'));

        for (const file of commandFiles) {
            // Dynamically import the command via path.
            const command = await import(`../../newcommands/${f.name}/${file}`);
    
            // Register the command locally.
            client.commands.set(command.name, command);
        }
    });

    // https://discordjs.guide/creating-your-bot/command-handling.html#reading-command-files

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
    
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    });

    // Register command groups.
    // client.registry.registerGroups([ 
    //     ['website', 'Website'],
    //     ['info', 'Information'],
        
    //     ['community', 'Community'],
    //     ['sacrifice', 'Sacrifice'],
    //     ['election', 'Election'],
    //     ['messages', 'Message'],
        
    //     ['advertise', 'Advertise'],
    //     ['blog', 'Blog'],
    //     ['projects', 'Projects'],
    //     ['productivity', 'Productivity'],

    //     ['mod', 'Moderation'],

    //     ['conquest', 'Conquest'],
    //     ['ownership', 'Item ownership/economy shares'],
    //     ['skills', 'Skills'],
    //     ['economy', 'Economy'],
    //     ['points', 'Points'],
    //     ['util', 'Utility'],
    //     ['misc', 'Miscellaneous'],
    //     ['gamble', 'Gamble']
    // ])

    // Register default types for args usage.
    // .registerDefaultTypes()

    // Point to path.
    // .registerCommandsIn(path.join(__dirname, '../../commands'));
}
