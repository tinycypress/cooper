import { Client } from 'discord.js-commando';
import Database from './database';
import dotenv from 'dotenv';


// v DEV IMPORT AREA v
import COOP from '../coop';
import SacrificeHelper from '../../operations/members/redemption/sacrificeHelper';
// ^ DEV IMPORT AREA ^

// Load ENV variables.
dotenv.config();


// Commonly useful.
// const listenReactions = (fn) => COOP.STATE.CLIENT.on('messageReactionAdd', fn);
// const listenMessages = (fn) => COOP.STATE.CLIENT.on('message', fn);

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

        // Fix trade
        
        // Implement a limit for ridiculous size/growth/pace of item_qty_change_history row count
        // Add a trade reminder message every so often with tip !trade
        // Implement a limit to !transactions history output

        // Election message needs deleting if user banned/leaves
        // Trades need deleting if user banned/leaves
        
        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();