import path from 'path';
import { Client } from 'discord.js-commando';

import joined from "../../operations/activity/welcome/joined";
import left from "../../operations/activity/welcome/left";
import messageAddedHandler from "../../operations/activity/messageAdded";
import reactAddedHandler from "../../operations/activity/reactionAdded";


export default () => {
    const client = new Client({ owner: '799692429442809937' });

    // Register command groups.
    client.registry.registerGroups([ 
            ['info', 'Information'],
            ['community', 'Community'],
            ['election', 'Election'],
            ['sacrifice', 'Sacrifice'],
            ['util', 'Utility'],
            ['messages', 'Message'],
            ['items', 'Item'],
            ['economy', 'Economy'],
            ['productivity', 'Productivity'],
            ['skills', 'Skills'],
            ['misc', 'Miscellaneous'],
            ['points', 'Points'],
            ['gamble', 'Gamble'],
            ['structures', 'Structures'],
            ['mod', 'Moderation'],
            ['conquest', 'Conquest']
        ]);
        
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