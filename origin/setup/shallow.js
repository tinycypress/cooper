import { Client } from 'discord.js-commando';
import dotenv from 'dotenv';

import Database from './database';

import VotingHelper from '../../operations/activity/redemption/votingHelper';
import COOP from '../coop';
import SkillsHelper from '../../operations/minigames/medium/skills/skillsHelper';

// Commonly useful.
// const listenReactions = (fn) => COOP.STATE.CLIENT.on('messageReactionAdd', fn);
// const listenMessages = (fn) => COOP.STATE.CLIENT.on('message', fn);


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

        
        // Community velocity
            // Calculate + persist + feedback the number, less often (unless fast).
            // Affect item drops and minigame speeds.
            // Detect velocity highscore

        // Fix Cooper reaction spam that he doesn't have an egg.

        // Structures

        // Add some more silent hyperlinked mentions. :D
        
        // Fail properly and loud on database not queryable.

        // Attempt to include evil coop image

        // !accuse command and court system, create a case channel.

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();