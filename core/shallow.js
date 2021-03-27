import { Client } from 'discord.js-commando';
import Database from './setup/database';
import STATE from './state';
import dotenv from 'dotenv';

// v DEV IMPORT AREA v
import fetch from 'node-fetch';
import UsersHelper from './entities/users/usersHelper';
import ServerHelper from './entities/server/serverHelper';
import CratedropMinigame from '../community/features/minigame/small/cratedrop';
import ElectionHelper from '../community/features/hierarchy/election/electionHelper';
import SacrificeHelper from '../community/features/events/sacrificeHelper';
// ^ DEV IMPORT AREA ^

// Load ENV variables.
dotenv.config();

// NOTES AND LONGER TERM CHALLENGES/ISSUES:

    // General/Straightforward
        // Sacrifice message at the top of channel HALF_DONE

    // Hard, Quick:

    // Harder:
        // MOTW automation.
        // Detect server message/activity velocity increases (as % preferably).
        // Community set and managed variable/value.

const shallowBot = async () => {
    // Instantiate a CommandoJS "client".
    STATE.CLIENT = new Client({ owner: '786671654721683517' });

    // Connect to Postgres database.
    await Database.connect();
    
    // Login, then wait for the bot to be fully online before testing.
    await STATE.CLIENT.login(process.env.DISCORD_TOKEN);
    STATE.CLIENT.on('ready', async () => {
        console.log('Shallow bot is ready');
        // DEV WORK AND TESTING ON THE LINES BELOW.

        // const memb = UsersHelper._get('789972974781333516');
        // UsersHelper.removeFromDatabase(memb);

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();