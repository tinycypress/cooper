import dotenv from 'dotenv';
import { Client, Intents } from 'discord.js';

// v DEV IMPORT AREA v
import Database from './database.mjs';
import COOP, { ITEMS, USERS } from '../coop.mjs';
import DatabaseHelper from '../../operations/databaseHelper.mjs';
import UsersHelper from '../../operations/members/usersHelper.mjs';
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


        // Check link is valid
        // const link = 'https://discord.com/channels/723660447508725802/724212582633963540/773945284782850099';
        // const introMsg = await MESSAGES.getByLink(link);
        // USERS.setIntro(introMsg.author.id, introMsg.content, link, introMsg.createdTimestamp);

        // COOP.USERS.updateField(id, 'historical_points', points);
        // const shares = await ITEMS.getAllItemOwners('COOP_POINT');
        // console.log(shares);

        // await Promise.all(shares.map(s => USERS.updateField(s.owner_id, 'historical_points', s.quantity)));
        // console.log('Updated all historical points');

        // TODO:
        // https://developer.algorand.org/docs/features/asa

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();