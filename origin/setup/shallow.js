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
        
        // Transactions command exists already. -> Last 500 transactions/self-cleaning
        // All item shares (postgres query)

    
        const results = await DatabaseHelper.manyQuery({
            name: 'all-item-shares',
            text: `SELECT DISTINCT 
                i.owner_id, i.quantity, i.item_code, total_qty, ROUND((i.quantity / total_qty) * 100) as share
                FROM items i
                    INNER JOIN ( 
                        SELECT item_code, MAX(quantity) AS highest, SUM(quantity) as total_qty
                        FROM items
                        GROUP BY item_code
                    ) AS grouped_items
                    ON  grouped_items.item_code = i.item_code
                    AND grouped_items.highest = i.quantity`
        });

        console.log(results);

        // Recurring event for testing prospects.
        // Code for handling prospects.

		
        // Structures
        // Paypal in/out // Track deficit (use detail reserved)
        // Add cost command (democratically approved)
        // 100dz integration TODOs

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();