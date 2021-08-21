import path from 'path';
import { Client } from 'discord.js-commando';
import { SlashCreator, GatewayServer } from 'slash-create';

import joined from "../../operations/activity/welcome/joined";
import left from "../../operations/activity/welcome/left";
import messageAddedHandler from "../../operations/activity/messageAdded";
import reactAddedHandler from "../../operations/activity/reactionAdded";



export default () => {
    const client = new Client({ owner: '799692429442809937' });

    const creator = new SlashCreator({
        applicationID: process.env.DISCORD_APPID,
        publicKey: process.env.DISCORD_PUBLICKEY,
        token: process.env.DISCORD_TOKEN
    });
      
    creator.withServer(new GatewayServer((handler) => client.ws.on('INTERACTION_CREATE', handler)))
        .registerCommandsIn(path.join(__dirname, 'slashcommands'))
        .syncCommands();

    // Register command groups.
    client.registry.registerGroups([ 
        ['website', 'Website'],
        ['info', 'Information'],
        
        ['community', 'Community'],
        ['sacrifice', 'Sacrifice'],
        ['election', 'Election'],
        ['messages', 'Message'],
        
        ['advertise', 'Advertise'],
        ['blog', 'Blog'],
        ['projects', 'Projects'],
        ['productivity', 'Productivity'],

        ['mod', 'Moderation'],

        ['conquest', 'Conquest'],
        ['ownership', 'Item ownership/economy shares'],
        ['skills', 'Skills'],
        ['economy', 'Economy'],
        ['points', 'Points'],
        ['util', 'Utility'],
        ['misc', 'Miscellaneous'],
        ['gamble', 'Gamble']
    ])        
    
    // Register default types for args usage.
    .registerDefaultTypes()

    // Point to path.
    .registerCommandsIn(path.join(__dirname, '../../commands'));


    // Add handler for reaction added
    client.on('messageReactionAdd', reactAddedHandler);

    // Handler for a new member has joined
    client.on("guildMemberAdd", joined);

    // Member left handler.
    client.on('guildMemberRemove', left);

    // Message interceptors.
    client.on("message", messageAddedHandler);

    return client;
}