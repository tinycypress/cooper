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

        // Toxic eggs and bombs... check if user has invincibility

        // Make shields craftable?
        // RPG


        // STATE.CLIENT.on('messageReactionAdd', (reaction, user) => {
        //     console.log(reaction.emoji);
        // });




        // const exp = await SkillsHelper.getXP("crafting", "786671654721683517");
        // console.log(exp);

        // const lvl = await SkillsHelper.getLevel("crafting", "786671654721683517");
        // console.log(lvl);

        // await SkillsHelper.addXP('786671654721683517', 'crafting', 100);


        // const expNew = await SkillsHelper.getXP("crafting", "786671654721683517");
        // console.log(expNew);

        // const lvlNew = await SkillsHelper.getLevel("crafting", "786671654721683517");
        // console.log(lvlNew);

        // console.log(SkillsHelper.calcLvl(0));
        // console.log(SkillsHelper.calcLvl(10));
        // console.log(SkillsHelper.calcLvl(100));
        // console.log(SkillsHelper.calcLvl(1000));
        // console.log(SkillsHelper.calcLvl(10000));
        // console.log(SkillsHelper.calcLvl(100000));
        // console.log(SkillsHelper.calcLvl(1000000));

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();