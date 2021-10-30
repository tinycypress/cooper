import dotenv from 'dotenv';
import { Client, Intents, Permissions } from 'discord.js';

import Database from './database.mjs';

// v DEV IMPORT AREA v
import COOP from '../coop.mjs';
// ^ DEV IMPORT AREA ^

// Load ENV variables.
dotenv.config();

// Commonly useful.
// const listenReactions = (fn) => COOP.STATE.CLIENT.on('messageReactionAdd', fn);
// const listenMessages = (fn) => COOP.STATE.CLIENT.on('message', fn);

const shallowBot = async () => {
    // Instantiate a CommandoJS "client".
    COOP.STATE.CLIENT = new Client({ 
        owner: '786671654721683517',
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS
        ]
    });

    // Connect to Postgres database.
    await Database.connect();
    
    // Login, then wait for the bot to be fully online before testing.
    await COOP.STATE.CLIENT.login(process.env.DISCORD_TOKEN);
    COOP.STATE.CLIENT.on('ready', async () => {
        console.log('Shallow bot is ready');
        // DEV WORK AND TESTING ON THE LINES BELOW.

        // Track competitions (due or not)
        // Announce and show channel when active

        // Show the channel.
        // COOP.CHANNELS._hide('845603592940945418');
        // COOP.CHANNELS._show('845603592940945418');
        // bizChan.lockPermissions();

        // Allow people to register for competition
        // Allow posting of entries
        // Declare winner and hide channel when ended

        // TODO:
        // https://developer.algorand.org/docs/features/asa

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();