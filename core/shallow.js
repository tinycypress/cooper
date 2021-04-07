import { Client } from 'discord.js-commando';
import Database from './setup/database';
import STATE from './state';
import dotenv from 'dotenv';
import SuggestionsHelper from '../community/features/suggestions/suggestionsHelper';
import MessagesHelper from './entities/messages/messagesHelper';
import UsersHelper from './entities/users/usersHelper';
import ChannelsHelper from './entities/channels/channelsHelper';

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

        // MOTW

        // This would nicely introduce some decimal numbers.
        // Easter egg gives you the average number of coop points from !it


        // Add some more silent hyperlinked mentions. :D
        // Try to ping leaders msg.channel.send("<@&724394130465357915>", { allowedMentions: { roles: []}})
        // message.channel.send('content', {"allowedMentions": { "users" : []}})

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();