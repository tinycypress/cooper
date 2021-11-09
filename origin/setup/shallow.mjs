import dotenv from 'dotenv';
import { Client, Intents } from 'discord.js';
import Database from './database.mjs';
import COOP from '../coop.mjs';

// v DEV IMPORT AREA v
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


        // Investigate crate reactions not working. :/
        const testMsg = await COOP.MESSAGES.getByLink('https://discord.com/channels/723660447508725802/779341376630292521/907430500698845255');

        const reaction = testMsg.reactions.resolve('👌')

        const reactionUsers = await reaction.users.fetch();
        const hitters = Array.from(reactionUsers
            .filter(user => !COOP.USERS.isCooper(user.id))
        ).map(userSet => userSet[1]);
        // const hitterNames = hitters.map(user => user.username);

        console.log(hitters);


        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();