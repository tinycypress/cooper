import _ from 'lodash'
import { STATE, CHANNELS, MESSAGES, USERS, ROLES, REACTIONS, TIME } from "../../origin/coop.mjs";
import { CHANNELS as CHANNELS_CONFIG } from "../../origin/config.mjs";

import DatabaseHelper from "../databaseHelper.mjs";
import EventsHelper from "../eventsHelper.mjs";
import Database from '../../origin/setup/database.mjs';

export const COMPETITION_DUR = 1000 * 3600 * 24 * 7;

export const COMPETITION_ROLES = {
    // TECHNOLOGY_COMPETITION: CODE,
    // ART_COMPETITION: ART,
    // BUSINESS_COMPETITION: BUSINESS
    TECHNOLOGY_COMPETITION: 'COMMANDER',
    ART_COMPETITION: 'COMMANDER',
    BUSINESS_COMPETITION: 'COMMANDER'
};

export default class CompetitionHelper {

    static async get(code) {
        const competitions = await DatabaseHelper.manyQuery({
            name: "load-competition",
            text: `SELECT * FROM events WHERE event_code = $1`,
            values: [code]
        });
        return competitions;
    }

    static async load() {
        const competitions = await DatabaseHelper.manyQuery({
            name: "load-competitions",
            text: `SELECT * FROM events WHERE event_code 
                IN ('technology_competition', 'art_competition', 'business_competition')`,
            });
        return competitions;
    }

    static formatCode(code) {
        return code.replace('_', ' ').toLowerCase();
    }

    static saveEntrant(code, user) {
        return Database.query({
            name: 'add-competition-entrant',
            text: 'INSERT INTO competition_entries (entrant_id, competition) VALUES ($1, $2)',
            values: [user.id, code]
        });
    }

    static loadEntrant(code, user) {
        return DatabaseHelper.singleQuery({
            name: 'load-competition-entrant',
            text: 'SELECT * FROM competition_entries WHERE entrant_id = $1 AND competition = $2',
            values: [user.id, code]
        });
    }

    static loadEntrants(code) {
        return DatabaseHelper.manyQuery({
            name: 'load-competition-entrants',
            text: 'SELECT * FROM competition_entries WHERE competition = $1',
            values: [code]
        });
    }

    static async setActive(code, active) {
        return await DatabaseHelper.singleQuery({
            name: "set-competition-status",
            text: 'UPDATE events SET active = $2 WHERE event_code = $1',
            values: [code, !!active]
        });
    }

    static async setTitle(code, title) {
        return await DatabaseHelper.singleQuery({
            name: "set-competition-title",
            text: 'UPDATE events SET title = $2 WHERE event_code = $1',
            values: [code, title]
        });
    }

    static async setDescription(code, description) {
        return await DatabaseHelper.singleQuery({
            name: "set-competition-description",
            text: 'UPDATE events SET description = $2 WHERE event_code = $1',
            values: [code, description]
        });
    }

    static async setMessageLink(code, link) {
        return await DatabaseHelper.singleQuery({
            name: "set-competition-message",
            text: 'UPDATE events SET message_link = $2 WHERE event_code = $1',
            values: [code, link]
        });
    }

    static isCompetitionChnanel(id) {
        const { TECHNOLOGY_COMPETITION, ART_COMPETITION, BUSINESS_COMPETITION } = CHANNELS_CONFIG;
        const compChannels = [TECHNOLOGY_COMPETITION, ART_COMPETITION, BUSINESS_COMPETITION];
        return compChannels.some(c => c.id === id);
    }

    static compCodeFromChannelID(id) {
        let competitionCode = null;
        _.each(CHANNELS_CONFIG, (v, k) => {
            if (v.id === id)
                competitionCode = k.toLowerCase();
        });
        return competitionCode;
    }

    static setEntryMessageID(entryID, messageID) {
        return Database.query({
            text: 'UPDATE competition_entries SET entry_msg_id = $2 WHERE id = $1',
            values: [entryID, messageID]
        });
    }

    static clearCompetitionEntrants(code) {
        return Database.query({
            text: 'DELETE FROM competition_entries WHERE competition = $1',
            values: [code]
        });
    }

    // Calculate the votes present on a competition entry.
    static async countEntryVotes(entry) {
        // Start on the votes object.
        let votes = 0;

        // Access the channel for this competition.
        const channel = CHANNELS._getCode(entry.competition);

        // Load the messages/submission for each entrant.
        const message = await channel.messages.fetch(entry.entry_msg_id);

        // Count the votes on the message/submission.
        await Promise.all(message.reactions.cache.map(async r => {
            // Only pay attention to trophy emojis.
            if (r.emoji.name !== '🏆') return;

            // Load the reaction users.
            const reactionUsers = await r.users.fetch();
            reactionUsers.map(ru => {
                // Ignore Cooper's vote.
                if (USERS.isCooper(ru.id)) return;

                // Ignore message author voting for self.
                if (entry.entrant_id === ru.id) return;

                // Track this vote as counting.
                votes++;
            });
        }));

        // Return the total number of votes.
        return votes;
    }

    // Check the most important things at the beginning of a new day.
    static async check(competition) {
        // Attach a vote tracking object.
        competition.votes = {};

        // Get entries for competition.
        const entries = await this.loadEntrants(competition.event_code);

        // Attach entries object.
        competition.entries = entries;

        // Count votes and attach to competition checking result.
        await Promise.all(entries.map(async e => {
            competition.votes[e.entrant_id] = await this.countEntryVotes(e);
        }));

        // Return the result in the check.
        return competition;
    }

    static async start(code) {
        // Make sure event last occurred time is updated.
        await EventsHelper.update(code, Date.now());

        // Explicitly declare event started.
        await this.setActive(code, true);

        // Show the channel
        const channelID = CHANNELS._getCode(code.toUpperCase()).id;
        CHANNELS._show(channelID);

        // Notify commands and leaeders that competition should receive details quickly.
        const initialMsgText = `**🏆 ${ROLES._textRef('COMMANDER')} & ${ROLES._textRef('LEADER')}, the ${this.formatCode(code)} will start here shortly! 🏆**\n\n` +
            `Leadership should add rules/details to channel description then press start ▶ below [will ping users - be ready]!`;

        // Add the initial message and the start reaction (with ping).
        const initialMsg = await CHANNELS._send(code.toUpperCase(), initialMsgText, {});

        // Capture and store/attach the competition main message link.
        const compMsgLink = MESSAGES.link(initialMsg);
        await this.setMessageLink(code, compMsgLink);

        // Add the reaction which will allow launching the competition when reacted with.
        MESSAGES.delayReact(initialMsg, '▶');
    }

    static async clear(code) {
        try {
            const channel = CHANNELS._getCode(code.toUpperCase());

            // This won't work with over 100 entries in a competition...
            // Swap to this loop method if this happens...
            // https://stackoverflow.com/questions/48228702/deleting-all-messages-in-discord-js-text-channel
            const msgs = await channel.messages.fetch({ limit: 100 });
            await channel.bulkDelete(msgs);
            return true;

        } catch(e) {
            console.log('Error clearing competition ' + code);
            console.error(e);
            return false;
        }
    }

    // Trigger this with a mod reaction (emoji)
    // Launch to the relevant population (this gives mods some time to fill in competition details).
    static async launch(code, reaction, user) {
        // Need to check if user is commander/leader
        const member = await USERS._fetch(user.id);
        if (!ROLES._has(member, 'COMMANDER') && !ROLES._has(member, 'LEADER'))
            return MESSAGES.selfDestruct(reaction.message, 'Only the commander/leaders may start a competition', 0, 5000);

        // Remove the launch message that is intended for leadership.
        await reaction.message.delete();

        // Access the channel to extract the details.
        const channel = await reaction.message.channel.fetch();

        // Don't ping feed, ping relevant role population instead.
        const relevantRoleCode = COMPETITION_ROLES[code.toUpperCase()];
        const pingableRoleText = ROLES._textRef(relevantRoleCode);

        // Add details on how to join the competition 
        const launchedCompMsgText = `**🏆 ${pingableRoleText} users, register soon, ${this.formatCode(code)} officially launched! 🏆**\n\n` +
            `**Details:** \n` +
            channel.topic + '\n\n';
            
        // The copy of the message with registering.
        const launchedCompRegisterMsgText = launchedCompMsgText +
            `_Join the ${this.formatCode(code)} now by reacting with 📋!_`;

        // Notify the relevant people for this competition (with ping).
        const launchedCompMsg = await CHANNELS._send(code.toUpperCase(), launchedCompRegisterMsgText, {});

        // Add the join reaction emoji/ability.
        MESSAGES.delayReact(launchedCompMsg, '📋');
    }

    static async register(code, reaction, user) {
        // Check not already registered on this competition.
        const entrant = await this.loadEntrant(code, user);
        if (entrant)
            return MESSAGES.selfDestruct(reaction.message, 'You are already registered to this competition.', 0, 5000);

        // Store in database table for competition.
        await this.saveEntrant(code, user);

        // Add details on how to join the competition 
        const registerCompMsgText = `📋 <@${user.id}> registered for the ${CHANNELS.textRef(code.toUpperCase())}!`;

        // Make sure to post it to feed, add some nice reactions (with ping).
        const registeredFeedMsg = await CHANNELS._send('FEED', registerCompMsgText, {});

        // Add four leaf clover so people can wish good luck
        MESSAGES.delayReact(registeredFeedMsg, '🍀');
    }

    static async end(code) {
        // Set competition is not active.
        await this.setActive(code, false);

        // Notify people it's over with results, in talk not competition channel (invisible).
        // Debug.
        // console.log(code + ' end');
        // CHANNELS._send(code.toUpperCase(), code + ' end');
        // CHANNELS._send('TALK', code + ' end');

        // Calculate the winner by votes.
        
        // Reward the winners.
        
        // Declare the competition winner.

        // Clear the messages.
        this.clear(code);

        // Clear the entrants.
        this.clearCompetitionEntrants(code);

        // Hide the channel until next time
        const channelID = CHANNELS._getCode(code.toUpperCase()).id;
        CHANNELS._hide(channelID, code + ' is over, hiding until next time!');
    }

    static async track() {
        // Time reference ms.
        const now = TIME._secs();

        // Load all competitions.
        const competitions = await this.load();

        // Initial count of running competitions.
        let numRunning = competitions.reduce(comp => comp.active ? 1 : 0, 0);

        // Check if any of the competitions need starting/overdue.
        competitions.map(async comp => {
            // Parse the last occurred time into an integer.
            const compLastOccurred = parseInt(comp.last_occurred);

            // Check if within registration period.
            const isRegistrationPeriod = compLastOccurred + 3600 * 24 <= now;

            // Check if inactive competition should start.
            if (comp.active == false) {
                // Allow some time after competition has ran before starting another.
                const isDue = now - compLastOccurred > (COMPETITION_DUR * 2);

                // Attempt to start a competition if required.
                if (isDue && numRunning < 2) {
                    // Handle competition announcements and channels.
                    await this.start(comp.event_code);

                    // Make other checks aware this is starting and counted.
                    numRunning++;
                }
            }

            // Check if active competition
            if (comp.active) {
                // Create a text response to be modified conditionally (register period or not).
                let competitionUpdateText = 'Competition updating.';

                console.log(comp.active);

                // Check the competition.
                const progress = await this.check(comp);
                console.log(progress);

                // Load the information message.
                const compInfoMsg = await MESSAGES.getByLink(comp.message_link);

                // Allow some time after competition has ran before starting another.
                const hasExpired = now - compLastOccurred > COMPETITION_DUR;

                // Check if the competition should end now.
                if (hasExpired) {
                    // Handle competition announcements and channels.
                    await this.end(comp);

                    // Make other checks aware this is starting and counted.
                    numRunning--;
                }

                // Shared competition details text.
                const competitionDetailsText = `🏆 **__Competition details__** 🏆\n` +
                    (comp.title ? comp.title : ('Working Title...' + '\n')) +
                    (comp.description ? comp.description : ('Campaign managers should edit channel description to competition outline.' + '\n\n'));

                // If during registration stage, show most recent registrants.
                if (isRegistrationPeriod) {
                    // Edit the message to contain registration period content.
                    const firstFiveEntrantsByLatestFirst = progress.entries;

                    // Sort the entrants by largest id
                    firstFiveEntrantsByLatestFirst.sort((a, b) => a.id > b.id);

                    competitionUpdateText = competitionDetailsText + '\n\n' +

                        `**Registration open!**\n\n` +
                        `**Registrants:** \n` +

                        firstFiveEntrantsByLatestFirst.map(e => `<@${e.entrant_id}>`).join('\n') +

                        `_To register press the clipboard emoji on this message!_`
                        

                // If after registration stage, show current votes/winning users.
                } else {
                    // Remove registration emoji trigger if still visible.
                    if (await REACTIONS.userReactedWith(compInfoMsg, STATE.CLIENT.user.id, '📋')) 
                        compInfoMsg.reactions.cache.map(async r => {
                            // Ignore non-reaction emojis.
                            if (r.emoji.name !== '📋') return;
    
                            // Remove it since it's matching.
                            r.remove();
                        });

                    // Edit the message to contain registration period content.
                    const firstFiveEntrantsByVotes = progress.entries;

                    // Sort the entrants by largest id
                    firstFiveEntrantsByVotes.sort((a, b) => progress.votes[a.entrant_id] > progress.votes[b.entrant_id]);

                    // Edit the message to contain post-registration period content.
                    competitionUpdateText = (
                        competitionDetailsText +
                        `**${this.formatCode(comp.event_code)} continues!**\n\n` +

                        `**Currently winning:** \n\n` +
                        firstFiveEntrantsByVotes.map(e => (
                            `<@${e.entrant_id}> - ${progress.votes[e.entrant_id]} vote(s)`
                        )).join('\n') +
                        `\n\n_For more information/details check website: link soon_`
                    );
                }

                // Edit the first message that has been posted at top of comp channel.
                compInfoMsg.edit(competitionUpdateText);
            }
        });
    } 

    static async onChannelUpdate(chanUpdate) {
        // Ensure it's a competition channel.
        if (!this.isCompetitionChnanel(chanUpdate.id)) return false;

        // Make sure to request the most up to date channel data.
        const freshChan = await chanUpdate.fetch();

        // Figure out which competition it is from the ID.
        const competitionCode = this.compCodeFromChannelID(chanUpdate.id);

        // Get the new title and description.
        if (freshChan.topic) {
            const topicParts = freshChan.topic.split('\n');
            const title = topicParts[0];
            const description = topicParts.slice(1).join('\n');
    
            // Store it in the database to make viewable from the website?
            await this.setTitle(competitionCode, title);
            await this.setDescription(competitionCode, description);
        }
    }

    static async onReaction(reaction, user) {
        try {
            // Check if it's a competition channel.
            if (!this.isCompetitionChnanel(reaction.message.channel.id)) 
                return false;

            // Check it's not Cooper.
            if (USERS.isCooper(user.id))
                return false;

            // Handle launch action.
            if (reaction.emoji.name === '▶')
                return this.launch(this.compCodeFromChannelID(reaction.message.channel.id), reaction, user);

            // Handle register action.
            if (reaction.emoji.name === '📋') {
                // Stop author voting for their self and from registering when not applicable.
                const cooperRegisterEmoji = await REACTIONS.userReactedWith(reaction.message, STATE.CLIENT.user.id, '📋');
                if (reaction.message.author.id === user.id || !cooperRegisterEmoji)
                    return await reaction.remove();

                // Register the user for the competition!
                const competitionCode = this.compCodeFromChannelID(reaction.message.channel.id);
                return this.register(competitionCode, reaction, user);
            }
        } catch (e) {
            console.log('Error handling competition reaction.');
            console.error(e);
        }
    }

    static async onMessage(msg) {
        // Check if it's a competition channel.
        if (!this.isCompetitionChnanel(msg.channel.id)) 
            return false;

        // Check it's not Cooper.
        if (USERS.isCooper(msg.author.id))
            return false;

        // Calculate the intended competition for submission.
        const code = this.compCodeFromChannelID(msg.channel.id);

        // Access the entrant.
        const entrant = await this.loadEntrant(code, msg.author);
        if (!entrant) {
            // Warn them about registering before posting.
            MESSAGES.selfDestruct(msg, 'You must register to submit your entry.', 0, 5000);

            // Make sure their unauthorized submission (message) will be removed.
            return MESSAGES.ensureDeletion(msg);
        }

        // Ensure no existing entry already.
        if (entrant.entry_msg_id) {
            // Warn them about registering before posting.
            MESSAGES.selfDestruct(msg, 'You already have a submission entry/message, edit that instead.', 0, 5000);
            return MESSAGES.ensureDeletion(msg);
        }

        // Attach entry message to entrant
        await this.setEntryMessageID(entrant.id, msg.id);

        // Add the trophy emoji for voting
        MESSAGES.delayReact(msg, '🏆');
    }

}