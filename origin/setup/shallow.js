import { Client } from 'discord.js-commando';
import Database from './database';
import dotenv from 'dotenv';



// v DEV IMPORT AREA v
import COOP, { MESSAGES } from '../coop';
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


        const msg = await MESSAGES.getByLink('https://discord.com/channels/723660447508725802/762472730980515870/811321280682655784')




        MESSAGES.delayEdit(msg, 
            "**Community Games (Opt in) 🎲**\n" +

            "We have a few games and features here that you may access by opt-ing in, we default to off to limit \"spam\" notifications.\n\n" +
            
            "**Gaming 🎮**\n" +
            "_To discuss games and arrange to play games with other members._\n\n" +
            
            "**Conquest 🗡 **\n" +
            "_Work in progress category for inter-communal conflict._\n\n" +

            "**Logs 📉**\n" +
            "_Logs and statistics for those who are **too interested**._"
        );


        // MESSAGES.delayReact(msg, '📉');

        // console.log(msg.content);
        // Add reaction
        // 📉

        // Edit this message
        // https://discord.com/channels/723660447508725802/762472730980515870/811321280682655784
        
        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();