import { Client } from 'discord.js-commando';
import Database from './setup/database';
import STATE from './state';
import dotenv from 'dotenv';
import UsersHelper from './entities/users/usersHelper';
import CratedropMinigame from '../community/features/minigame/small/cratedrop';
import ItemsHelper from '../community/features/items/itemsHelper';
import MessagesHelper from './entities/messages/messagesHelper';
import ChannelsHelper from './entities/channels/channelsHelper';
import EasterMinigame from '../community/features/minigame/holidays/easter';

// Commonly useful.
const listenReactions = (fn) => STATE.CLIENT.on('messageReactionAdd', fn);
const listenMessages = (fn) => STATE.CLIENT.on('message', fn);


// v DEV IMPORT AREA v

// ^ DEV IMPORT AREA ^

// Load ENV variables.
dotenv.config();

// NOTES AND LONGER TERM CHALLENGES/ISSUES:
    // Treasure room and temporary channel access.
    // Paid temporary/private channels


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

        // Detect easter with last_easter detected emoji, that way can launch a message. :D

        // Add bag emoji/bag word shows items via direct message.
        // Try to ping leaders msg.channel.send("<@&724394130465357915>", {allowedMentions: { roles: []}})

        // listenReactions(EasterMinigame.onReaction);
        // EasterMinigame.spawn();



        // ItemsHelper.add('763258365186801694', 'EASTER_EGG', 1);

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();