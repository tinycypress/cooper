import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import SERVERS from '../origin/config/servers.mjs';
import BOTS from '../origin/config/bots.json';

dotenv.config();

const slashCommands = [];

// Parse throuh the command files
const commandsDir = path.resolve('./commands/');
const commandFolders = fs.readdirSync(commandsDir,  { withFileTypes: true }).filter(de => de.isDirectory());
commandFolders.map(async f => {
    const cmdFolderPath = commandsDir + '/' + f.name + '/';
    const commandFiles = fs.readdirSync(cmdFolderPath).filter(file => file.endsWith('.mjs'));

    for (const file of commandFiles) {
        // Dynamically import the command via path.
        const command = await import(`../commands/${f.name}/${file}`);

        // Add to meta for slash command registration.
        slashCommands.push(command.data.toJSON());
    }
});

// Register the slash commands with the Discord rest API.
const rest = new REST({ version: '9' })
    .setToken(process.env.DISCORD_TOKEN);

try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
        Routes.applicationGuildCommands(BOTS.COOPER.id, SERVERS.PROD.id),
        { body: slashCommands },
    );

    await rest.put(
        Routes.applicationCommands(BOTS.COOPER.id),
        { body: slashCommands },
    );
    
} catch (error) {
    console.error(error);
}
