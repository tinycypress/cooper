import { Client } from 'discord.js-commando';
import dotenv from 'dotenv';

import Database from './database';

import COOP, { CHANNELS, ITEMS, MESSAGES, ROLES, SERVER, TIME, USERS } from '../coop';

import EventsHelper from '../../operations/eventsHelper';

import { status } from '../../operations/marketing/rewards/loyalty';
import client from './client';
import UsersHelper from '../../operations/members/usersHelper';
import RolesHelper from '../../operations/members/hierarchy/roles/rolesHelper';
import DatabaseHelper from '../../operations/databaseHelper';

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
        
        // Democratic unban


        
		// Track deficit
		// Track coin price
		// Track coin value


        // Structures
        // Paypal in/out
        // 100dz integration TODOs

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();