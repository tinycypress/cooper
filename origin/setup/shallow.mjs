import dotenv from 'dotenv';
import { Client, Intents, Permissions } from 'discord.js';

import Database from './database.mjs';

// v DEV IMPORT AREA v
import COOP from '../coop.mjs';
import DatabaseHelper from '../../operations/databaseHelper.mjs';
import ActivityHelper from '../../operations/activity/activityHelper.mjs';
import axios from 'axios';
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
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_PRESENCES
        ]
    });

    // Connect to Postgres database.
    await Database.connect();
    
    // Login, then wait for the bot to be fully online before testing.
    await COOP.STATE.CLIENT.login(process.env.DISCORD_TOKEN);
    COOP.STATE.CLIENT.on('ready', async () => {
        console.log('Shallow bot is ready');
        // DEV WORK AND TESTING ON THE LINES BELOW.

        // Toggle link preview off?

        const goog = await COOP.MESSAGES.getByLink('https://discord.com/channels/723660447508725802/779341376630292521/904453846619811902');
        console.log(goog);

        goog.suppressEmbeds();

        // Supporter role/donation
        // Charity register
        // Mention without pinging?
        // Restore items

        // TODO:
        // https://developer.algorand.org/docs/features/asa

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();