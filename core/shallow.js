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
import RolesHelper from './entities/roles/rolesHelper';
import BuffsHelper, { BUFF_TYPES } from '../community/features/conquest/buffsHelper';
import SkillsHelper from '../community/features/skills/skillsHelper';
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

        // RPG
        // Level up detection and reward on being first to get 99

        
        // Leaderboards for skill xp ALL and SPECIFIC

        // const skillLeaderboard = await SkillsHelper.getSkillXPLeaderboard('crafting');
        // console.log(skillLeaderboard);

        const totalLeaderboard = await SkillsHelper.getTotalXPLeaderboard();
        console.log(totalLeaderboard);


        // SkillsHelper.addXP('786671654721683517', 'crafting', 1);


        // EXP TO NEXT LEVEL COMMAND
        // EXP TO LEVEL CONVERT COMMAND
        // LEVEL TO EXP CONVERT COMMAND
        // Give crafting, woodcutting, mining EXP.
        
        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();