import { Client } from 'discord.js-commando';
import Database from './setup/database';
import STATE from './state';
import dotenv from 'dotenv';
import SkillsHelper from '../community/features/skills/skillsHelper';
import RPGHandler from '../community/features/items/handlers/rpgHandler';
import SacrificeHelper from '../community/features/events/sacrificeHelper';
import ItemsHelper from '../community/features/items/itemsHelper';
import EggHuntMinigame from '../community/features/minigame/small/egghunt';

// Commonly useful.
const listenReactions = (fn) => STATE.CLIENT.on('messageReactionAdd', fn);
const listenMessages = (fn) => STATE.CLIENT.on('message', fn);


// v DEV IMPORT AREA v

// ^ DEV IMPORT AREA ^

// Load ENV variables.
dotenv.config();

// NOTES AND LONGER TERM CHALLENGES/ISSUES:

    // Done
        // Add health 
        // Enable decimal item quantity columns
        // Enable floats in some item commands/trade etc.
        // When someone posts a spam egg... trick them.


    // General/Straightforward
        // Coin flip

        // Add RPG effect.
        
        // Add easter eggs
        // Add bigboi role
        // Add check health command
        // Add way of gaining health

        // Gold coin purchase logic, balance, deficit.



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


        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();