import { Client } from 'discord.js-commando';
import Database from './database';
import dotenv from 'dotenv';


// v DEV IMPORT AREA v
import COOP from '../coop';

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



        // COOP.ITEMS.add('786671654721683517', 'RABBIT', 1);

        // TODO:
        // https://developer.algorand.org/docs/features/asa
        // operations/minigames/medium/economy/blockchain/_wipCreateAccounts.js
        // operations/minigames/medium/economy/blockchain/_wipAssetExample.js
        // operations/minigames/medium/economy/blockchain/_wipAssetOptin.js
        // operations/minigames/medium/economy/blockchain/_wipRevoke.js
        // CHANNELS._send('TALK', 'Blockchain testing via shallow bot.');

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();