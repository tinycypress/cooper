import dotenv from 'dotenv';
import { Client, Intents, Permissions } from 'discord.js';

import Database from './database.mjs';

// v DEV IMPORT AREA v
import COOP, { SERVER, STATE } from '../coop.mjs';
// ^ DEV IMPORT AREA ^



// Load ENV variables.
dotenv.config();

// Commonly useful.
const listenReactions = (fn) => COOP.STATE.CLIENT.on('messageReactionAdd', fn);
const listenChannelUpdates = (fn) => COOP.STATE.CLIENT.on('channelUpdate', fn);
const listenMessages = (fn) => COOP.STATE.CLIENT.on('messageCreate', fn);

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

        listenReactions((reaction, user) => CompetitionHelper.onReaction(reaction, user));
        // listenChannelUpdates(chanUpdate => CompetitionHelper.onChannelUpdate(chanUpdate));
        listenMessages(msg => CompetitionHelper.onMessage(msg));

        // CompetitionHelper.start('business_competition');
        // CompetitionHelper.end('business_competition');


        const guild = SERVER._coop();
        console.log(guild);

        // Restore items

        // Load donation by ID to check for that custom field
        // Add raisely encryption key for comparison (add to heroku)

        // Waiting for support reply
        // Tied together:
        // Supporter role/donation
        // Charity register

        // TODO:
        // https://developer.algorand.org/docs/features/asa

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();