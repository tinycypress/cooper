import { Client, Intents } from "discord.js";
import setupCommands from './commands.mjs';

import joined from "../../operations/activity/welcome/joined.mjs";
import left from "../../operations/activity/welcome/left.mjs";
import messageAddedHandler from "../../operations/activity/messageAdded.mjs";
import reactAddedHandler from "../../operations/activity/reactionAdded.mjs";

export default async () => {
    // Instantiate a Discord.JS
    const client = new Client({ 
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS
        ]
    });

    // Setup the slash and local commands.
    setupCommands(client);

    // Add handler for reaction added
    client.on('messageReactionAdd', reactAddedHandler);

    // Handler for a new member has joined
    client.on("guildMemberAdd", joined);

    // Member left handler.
    client.on('guildMemberRemove', left);

    // Message interceptors.
    client.on("messageCreate", messageAddedHandler);

    return client;
}