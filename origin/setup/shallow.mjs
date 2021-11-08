import dotenv from 'dotenv';
import { Client, Intents, MessageMentions } from 'discord.js';

// v DEV IMPORT AREA v
import Database from './database.mjs';
import COOP, { CHANNELS, ITEMS, USERS, MESSAGES } from '../coop.mjs';
import DatabaseHelper from '../../operations/databaseHelper.mjs';
import UsersHelper from '../../operations/members/usersHelper.mjs';
import ItemsHelper from '../../operations/minigames/medium/economy/items/itemsHelper.mjs';
import SuggestionsHelper from '../../operations/activity/suggestions/suggestionsHelper.mjs';
import ProjectsHelper from '../../operations/productivity/projects/projectsHelper.mjs';

import CATEGORIES from '../../origin/config/categories.json';

// ^ DEV IMPORT AREA ^

// Load ENV variables.
dotenv.config();

// Commonly useful.
const listenReactions = (fn) => COOP.STATE.CLIENT.on('messageReactionAdd', fn);
const listenChannelUpdates = (fn) => COOP.STATE.CLIENT.on('channelUpdate', fn);
const listenMessages = (fn) => COOP.STATE.CLIENT.on('messageCreate', fn);

const shallowBot = async () => {
    // Instantiate a CommandoJS "client".
    COOP.STATE.CLIENT = new Client({ 
        owner: '786671654721683517',
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_PRESENCES
        ]
    });

    // Connect to Postgres database.
    await Database.connect();
    
    // Login, then wait for the bot to be fully online before testing.
    await COOP.STATE.CLIENT.login(process.env.DISCORD_TOKEN);
    COOP.STATE.CLIENT.on('ready', async () => {
        console.log('Shallow bot is ready');
        // DEV WORK AND TESTING ON THE LINES BELOW.

        // const projects = await ProjectsHelper.all();
        // console.log(projects);

        // const query = {
        //     name: "get-all-projects-with-username",
        //     text: `SELECT * FROM projects
        //         INNER JOIN users 
        //         ON projects.owner_id = discord_id
        //     `
        // };
        // const result = await DatabaseHelper.manyQuery(query);
        // console.log(result);

        const projectChannel = await CHANNELS.fetch('907380369236574208');
        console.log(projectChannel.parentId);

        // Check link is valid
        // const link = 'https://discord.com/channels/723660447508725802/724212582633963540/773945284782850099';
        // const introMsg = await MESSAGES.getByLink(link);
        // USERS.setIntro(introMsg.author.id, introMsg.content, link, introMsg.createdTimestamp);
        
        // const msgLink = 'https://discord.com/channels/723660447508725802/723710770591957075/906574282312794142';
        // const introMsg = await MESSAGES.getByLink(msgLink);

        // const projectsSuggestion = await SuggestionsHelper.checkSingle(introMsg);
        // ProjectsHelper.passed(introMsg);
        // console.log(me);

        // console.log(projectsSuggestion);

        // const matches = introMsg.content.match(MessageMentions.USERS_PATTERN);

        // console.log(matches);
        // console.log(MessageMentions.USERS_PATTERN);

        // const owner = projectsSuggestion.content.match(MessageMentions.USERS_PATTERN)[0] || null;
        // const title = MESSAGES.getRegexMatch(/Title: __([^\r\n]*)__/gm, projectsSuggestion.content);
        // const deadline = MESSAGES.getRegexMatch(/Deadline: ([^\r\n]*)/gm, projectsSuggestion.content);

        // // const { MessageMentions: { USERS_PATTERN } } = require('discord.js');

        // console.log(owner);
        // console.log(title);
        // console.log(deadline);

        // const txs = await ItemsHelper.getTransactionRowCount();
        // console.log(txs);

        // https://developer.algorand.org/docs/features/asa

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();