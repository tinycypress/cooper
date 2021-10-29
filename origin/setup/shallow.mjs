import dotenv from 'dotenv';
import { Client, Intents } from 'discord.js';

import Database from './database.mjs';


// v DEV IMPORT AREA v
import COOP, { CHANNELS, MESSAGES, USERS } from '../coop.mjs';
import { CHANNELS as CHANNELS_CONFIG } from '../config.mjs';
import _ from 'lodash';

import CompetitionHelper, { COMPETITION_DUR } from '../../operations/social/competitionHelper.mjs';
import EventsHelper from '../../operations/eventsHelper.mjs';
import BlogHelper from '../../operations/marketing/blog/blogHelper.mjs';
import BaseHelper from '../../operations/minigames/medium/conquest/baseHelper.mjs';
import DatabaseHelper from '../../operations/databaseHelper.mjs';
import test from '../../operations/minigames/medium/economy/blockchain/_testingAlgorand.mjs';
import PointsHelper from '../../operations/minigames/medium/economy/points/pointsHelper.mjs';
import SacrificeHelper from '../../operations/members/redemption/sacrificeHelper.mjs';
import AboutHelper from '../../operations/marketing/about/aboutHelper.mjs';
import ItemsHelper from '../../operations/minigames/medium/economy/items/itemsHelper.mjs';
import ElectionHelper from '../../operations/members/hierarchy/election/electionHelper.mjs';
import Chicken from '../../operations/chicken.mjs';



// ^ DEV IMPORT AREA ^

// Load ENV variables.
dotenv.config();



// Commonly useful.
// const listenReactions = (fn) => COOP.STATE.CLIENT.on('messageReactionAdd', fn);
// const listenMessages = (fn) => COOP.STATE.CLIENT.on('message', fn);

const shallowBot = async () => {
    // Instantiate a CommandoJS "client".
    COOP.STATE.CLIENT = new Client({ 
        owner: '786671654721683517',
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS
        ]
    });

    // Connect to Postgres database.
    await Database.connect();
    
    // Login, then wait for the bot to be fully online before testing.
    await COOP.STATE.CLIENT.login(process.env.DISCORD_TOKEN);
    COOP.STATE.CLIENT.on('ready', async () => {
        console.log('Shallow bot is ready');
        // DEV WORK AND TESTING ON THE LINES BELOW.


        // discord.js now has support for message components! This introduces the MessageActionRow, MessageButton, and MessageSelectMenu classes, as well as associated interactions and collectors.

        // ElectionHelper.startElection();

        // await Chicken.setConfig('election_on', 'true');
        // await Chicken.setConfig('last_election', parseInt(Date.now() / 1000));

        // Attempt to recognise each unrecognised user.

        // COMPETITIONS
        // Code
        // Art
        // Business

        // id: 2,
        // event_code: 'technology_competition',
        // last_occurred: '1633197189510',
        // active: true,
        // description: null

        // EventsHelper.update('art_competition', Date.now() - COMPETITION_DUR * 4);
        // EventsHelper.update('business_competition', Date.now() - COMPETITION_DUR * 4);
        // EventsHelper.update('technology_competition', Date.now() - COMPETITION_DUR * 4);
        // CompetitionHelper.track();

        // const comps = await CompetitionHelper.load();
        // console.log(comps);

        // Track competitions (due or not)
        // Announce and show channel when active
        // Allow people to register for competition
        // Allow posting of entries
        // Declare winner and hide channel when ended

        // TODO:
        // https://developer.algorand.org/docs/features/asa
        // operations/minigames/medium/economy/blockchain/_wipCreateAccounts.js
        // operations/minigames/medium/economy/blockchain/_wipAssetExample.js
        // operations/minigames/medium/economy/blockchain/_wipAssetOptin.js
        // operations/minigames/medium/economy/blockchain/_wipRevoke.js
        // CHANNELS._send('TALK', 'Blockchain testing via shallow bot.');

        // AboutHelper.preloadMesssages();

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();