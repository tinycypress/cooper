import { Client } from 'discord.js-commando';
import Database from './setup/database';
import STATE from './state';
import dotenv from 'dotenv';
import SuggestionsHelper from '../community/features/suggestions/suggestionsHelper';
import MessagesHelper from './entities/messages/messagesHelper';
import UsersHelper from './entities/users/usersHelper';
import ChannelsHelper from './entities/channels/channelsHelper';
import PointsHelper from '../community/features/points/pointsHelper';
import RolesHelper from './entities/roles/rolesHelper';
import ItemsHelper from '../community/features/items/itemsHelper';
import Chicken from '../community/chicken';

// Commonly useful.
const listenReactions = (fn) => STATE.CLIENT.on('messageReactionAdd', fn);
const listenMessages = (fn) => STATE.CLIENT.on('message', fn);


// v DEV IMPORT AREA v

// ^ DEV IMPORT AREA ^

// Load ENV variables.
dotenv.config();


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

        // Community velocity
            // Calculate + persist + feedback the number, less often (unless fast).
            // Affect item drops and minigame speeds.

        // Add some more silent hyperlinked mentions. :D
        
        // Fail properly and loud on database not queryable.

        const isNew = await Chicken.isNewDay();
        console.log(isNew);

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();