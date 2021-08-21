import { Permissions } from "discord.js";
import { EMOJIS, CATEGORIES } from "../../../origin/config";
import { CHANNELS, MESSAGES, TIME } from "../../../origin/coop";
import Database from "../../../origin/setup/database";


const getRegexMatch = (regex, str) => {
    let match = null;
    const result = regex.exec(str);
    if (result && result[1])
        match = result[1];
    return match;
}

// Show the user's projects on the website.
// Should add support for contributors so it can show up on their coop website profile.
export default class ProjectsHelper {

    static async passed(suggestion) {
        const owner = suggestion.mentions.users.first() || null;
        const title = getRegexMatch(/Title: __([^\r\n]*)__/gm, suggestion.content);
        const deadline = getRegexMatch(/Deadline: ([^\r\n]*)/gm, suggestion.content);
        
        const channel = await this.create(title, owner, deadline);

        // Is this necessary??
        const announcementMsg = await CHANNELS._postToChannelCode('FEED', `Project created! <#${channel.id}>`);
        MESSAGES.delayReact(announcementMsg, EMOJIS.GOLD_COIN);
    }

    static async create(name, owner, deadline) {
        try {


            // Create the channel under projects.
            const channel = await CHANNELS._create(name, {
                type: 'GUILD_TEXT',
                parent: CATEGORIES['PROJECTS'].id,
                // Set the owner and their permissons.
                permissionOverwrites: [
                    {
                        id: owner.id,
                        allow: [
                            Permissions.FLAGS.MANAGE_CHANNELS
                        ]
                    }
                ],
                reason: 'Democratically approve and paid for with GOLD_COIN',
                position: 9999
            });

            // Take human readable due time.
            const unixSecsDeadline = Math.round(TIME.parseHuman(deadline).getTime() / 1000);
            
            // Add the channel to the database.
            const query = {
                name: "create-project",
                text: `INSERT INTO projects(
                        title, description, 
                        channel_id, owner_id,
                        created, deadline
                    )
                    VALUES($1, $2, $3, $4, $5, $6)`,
                values: [
                    name, 'No description yet.',
                    channel.id, owner.id,
                    TIME._secs(), unixSecsDeadline
                ]
            };
            const result = await Database.query(query);

            return channel;

        } catch(e) {
            console.log('Error creating channel!');
            console.error(e);
            return null;
        }
    }

    static isSuggestionProjectReq(msg) {
        
    }

    static isValidDeadline(deadline) {
        // Take human readable due time.
		const dueDate = TIME.parseHuman(deadline);

		// Invalid input time feedback
		if (isNaN(dueDate)) return false;

		// Calculate unix secs for due/deadline.
		const dueSecs = Math.round(dueDate.getTime() / 1000);

		// Prevent too long of a deadline.
		if (dueSecs >= TIME._secs() + 3.154e+7) return false;

        // Valid
        return true;
    }
}



// Revenue opportunities:
// GOLD_COIN payments for egg drops/minigames consideration of channel
// GOLD_COIN payments for visibilty
// GOLD_COIN to prevent being archived / deleted

// export const PROJECT_ARGS_MSG_ORDER = [
//     'name', 'deadline', 'description', 'visibility'
// ];

// Default deadline to 1 week in seconds
// const weekSecs = ((60 * 60) * 24) * 7;
// export const DEFAULT_PROJECT_OPTS = {
//     name: 'unknown',
//     description: 'unknown',
//     deadline: weekSecs,
//     visibility: 'PRIVATE'
// };

// Price is irrelevant now, already paid.
// const price = getRegexMatch(/Price: <:gold_coin:796486327117807616> (\d+(?:\.\d+)?)/gm, suggestion.content);

// Apply meta info to the channel
// Mentions of access or PUBLIC keyword