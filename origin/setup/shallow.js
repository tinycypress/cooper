import { Client } from 'discord.js-commando';
import dotenv from 'dotenv';

import Database from './database';

import COOP, { SERVER } from '../coop';
import KeyInfoPosted from '../../operations/activity/messages/keyinfoPosted';
import TodoHelper from '../../operations/productivity/todos/todoHelper';
import TimeHelper from '../../operations/timeHelper';

// Commonly useful.
// const listenReactions = (fn) => COOP.STATE.CLIENT.on('messageReactionAdd', fn);
const listenMessages = (fn) => COOP.STATE.CLIENT.on('message', fn);


// v DEV IMPORT AREA v

// ^ DEV IMPORT AREA ^

// Load ENV variables.
dotenv.config();


const shallowBot = async () => {
    // Instantiate a CommandoJS "client".
    COOP.STATE.CLIENT = new Client({ owner: '786671654721683517' });

    // Connect to Postgres database.
    await Database.connect();
    
    // Login, then wait for the bot to be fully online before testing.
    await COOP.STATE.CLIENT.login(process.env.DISCORD_TOKEN);
    COOP.STATE.CLIENT.on('ready', async () => {
        console.log('Shallow bot is ready');
        // DEV WORK AND TESTING ON THE LINES BELOW.

        // Structures

        // TODOs
        // 100dz integration TODOs
        // Paypal in/out

       
        const userTodos = await TodoHelper.getUserTodos('786671654721683517');
        console.log(userTodos);




        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();