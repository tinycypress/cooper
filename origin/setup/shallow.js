import { Client } from 'discord.js-commando';
import Database from './database';
import dotenv from 'dotenv';


// v DEV IMPORT AREA v
import COOP, { SERVER } from '../coop';
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
        
        
        // Major problems with cleaning up messages and overflowing item_qty_change_history
        // 1. Clip item_qty_change_history / test / debug


        // 2. Debug what actually happens with temporary messages.
        // 2.1. Test deleting an expired temporary message.

        // const tempMessageLink = 'https://discord.com/channels/723660447508725802/724362429353558026/850082537628106772';
        // const tempMessage = await SERVER.getTempMessageByLink(tempMessageLink);
        // console.log(tempMessage);

        // Message was deleted from temp_messages but wasn't actually deleted.




        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();