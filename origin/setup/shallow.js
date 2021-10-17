import { Client } from 'discord.js-commando';
import Database from './database';
import dotenv from 'dotenv';


// v DEV IMPORT AREA v
import COOP, { CHANNELS } from '../coop';
import CompetitionHelper, { COMPETITION_DUR } from '../../operations/social/competitionHelper';
import EventsHelper from '../../operations/eventsHelper';

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

        // Make post previewable








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

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();