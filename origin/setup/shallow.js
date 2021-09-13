import { Client } from 'discord.js-commando';
import Database from './database';
import dotenv from 'dotenv';


// v DEV IMPORT AREA v
import COOP, { CHANNELS, MESSAGES, ROLES, USERS } from '../coop';
import { ROLES as ROLES_CONFIG } from '../config';

import UserRoles from '../../operations/members/hierarchy/roles/userRoles';
import DatabaseHelper from '../../operations/databaseHelper';
import RegisterSlashCommand from './slashregisterscript';
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


        const channels = [
            '724630911282577454',
            '723660447508725806',
            '731660320514506826',
            '724212582633963540',
            '723710770591957075',
            '762748248959483906',
            '816022755790815263',
            '748649755965522031',
            '779330384169009164',
            '779330344272396299',
            '779330299103674368',
            '841126959298773052',
            '762472730980515870',
            '730592584509947946',
            '779341376630292521',
            '779341495504339014',
            '796493571971874836',
            '796156573771759676',
            '796553158331596821',
            '796823730483363860',
            '724362429353558026',
            '796516850702876702',
            '822204573409083392',
            '779330299103674368',
            '779330384169009164'
        ]

        channels.map(chanID => {
            const chan = CHANNELS._get(chanID);
            if (!chan) console.log(chanID);
        });


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