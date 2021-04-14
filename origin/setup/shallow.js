import { Client } from 'discord.js-commando';
import dotenv from 'dotenv';

import Database from './database';

import COOP, { CHANNELS, MESSAGES, SERVER, TIME, USERS } from '../coop';

import EventsHelper from '../../operations/eventsHelper';

import { status } from '../../operations/marketing/rewards/loyalty';

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

        
        // Help command stub


        // EventsHelper.runInterval(status, 2000);

        // Structures
        // 100dz integration TODOs
        // Paypal in/out
                
        
        
        // TDOs less spammy
        // Fix items single check

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();