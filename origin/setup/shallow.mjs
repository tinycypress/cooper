import dotenv from 'dotenv';
import { Client, Intents } from 'discord.js';

// v DEV IMPORT AREA v
import Database from './database.mjs';
import COOP, { ITEMS, USERS } from '../coop.mjs';
import DatabaseHelper from '../../operations/databaseHelper.mjs';
import UsersHelper from '../../operations/members/usersHelper.mjs';
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




        // Combine items into user response
        // const rows = await DatabaseHelper.manyQuery({
        //     // SELECT *, items.item_list FROM users
        //     text: `
        //         SELECT username, items.item_list
        //         FROM users
        //         JOIN (
        //             SELECT 
        //                 json_agg(json_build_object(
        //                     'item_code', it.item_code,
        //                     'quantity', it.quantity
        //                 )) AS item_list,
        //                 owner_id
        //             FROM items it
        //             GROUP BY it.owner_id
        //         ) items ON users.discord_id = items.owner_id
        //         ` 
        // });


        const rows = await DatabaseHelper.manyQuery({
            // SELECT *, items.item_list FROM users
            text: `
                SELECT *, roles.role_list 
                FROM users
                JOIN (
                    SELECT array_agg(ur.role_code) AS role_list, discord_id
                    FROM user_roles ur
                    GROUP BY ur.discord_id
                ) roles USING (discord_id)
                LEFT JOIN (
                    SELECT 
                        json_agg(json_build_object(
                            'item_code', it.item_code,
                            'quantity', it.quantity
                        )) AS item_list,
                        owner_id
                    FROM items it
                    GROUP BY it.owner_id
                ) items ON users.discord_id = items.owner_id
                LEFT JOIN (
                    SELECT 
                        json_agg(json_build_object(
                            'author_username', bp.author_username,
                            'slug', bp.slug
                        )) AS blog_posts,
                        author_id
                    FROM blog_posts bp
                    GROUP BY bp.author_id
                ) blog_posts ON users.discord_id = blog_posts.author_id
                ORDER BY historical_points DESC NULLS LAST
            `
        });

        console.log(rows);

        // id              | integer               |           | not null | nextval('blog_posts_id_seq'::regclass)
        // date            | integer               |           |          | 
        // slug            | character varying(50) |           |          | 
        // title           | text                  |           |          | 
        // content         | text                  |           |          | 
        // author_id       | character varying     |           |          | 
        // author_username | character varying     |           |          | 
        // category        | character varying     |           |          | 




















        // Check link is valid
        // const link = 'https://discord.com/channels/723660447508725802/724212582633963540/773945284782850099';
        // const introMsg = await MESSAGES.getByLink(link);
        // USERS.setIntro(introMsg.author.id, introMsg.content, link, introMsg.createdTimestamp);

        // COOP.USERS.updateField(id, 'historical_points', points);
        // const shares = await ITEMS.getAllItemOwners('COOP_POINT');
        // console.log(shares);

        // await Promise.all(shares.map(s => USERS.updateField(s.owner_id, 'historical_points', s.quantity)));
        // console.log('Updated all historical points');

        // TODO:
        // https://developer.algorand.org/docs/features/asa

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });
};

shallowBot();