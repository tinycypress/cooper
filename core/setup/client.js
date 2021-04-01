import path from 'path';
import { Client } from 'discord.js-commando';

import joined from "../../community/events/members/welcome/joined";
import left from "../../community/events/members/welcome/left";
import messageAddedHandler from "../../community/events/message/messageAdded";
import reactAddedHandler from "../../community/events/reaction/reactionAdded";

export default () => {
    const client = new Client({ owner: '799692429442809937' });

    // Register command groups.
    client.registry
        .registerGroups([ 
            ['util', 'Utility'],
            ['community', 'Community'],
            ['messages', 'Message'],
            ['election', 'Election'],
            ['sacrifice', 'Sacrifice'],
            ['items', 'Item'],
            ['economy', 'Economy'],
            ['skills', 'Skills'],
            ['misc', 'Miscellaneous'],
            ['points', 'Points'],
            ['mod', 'Moderation'],
            ['info', 'Information']
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