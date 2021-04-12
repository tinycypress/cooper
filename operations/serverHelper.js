import SERVERS from '../origin/config/servers.json';

import Database from '../origin/setup/database';
import DatabaseHelper from './databaseHelper';

import COOP, { STATE } from '../origin/coop';
import Statistics from './activity/information/statistics';
import { VELOCITY_EVENTS } from './manifest';

export default class ServerHelper {
    static getByID(client, id) {
        return client.guilds.cache.get(id);
    }
    static getByCode(client, code) {
        return this.getByID(client, SERVERS[code].id);
    }
    static _coop() {
        return this.getByCode(COOP.STATE.CLIENT, 'PROD');
    }

    static _count() {
        const numBots = 1;
        const userCount = this._coop().memberCount - numBots || 0;
        return userCount;
    }


    // TODO: Refactor this as the main method for event timing... VELOCITY.
    static async tick() {
        const velocity = Statistics.calcCommunityVelocity();

        // Check each event to see if its late via velocity timings.
        Object.keys(STATE.VELOCITY).map(eventType => {
            // Seconds since last occurred.
            const absentSecs = STATE.VELOCITY[eventType] += 30;

            // Desired interval for event type.
            const desiredInterval = VELOCITY_EVENTS[eventType].interval;

            // Desired interval adjusted for community velocity.
            const desiredVelInterval = desiredInterval / velocity;

            // If late, cause the event to be sped up. :)
            if (absentSecs > desiredVelInterval) {
                STATE.VELOCITY[eventType] = 0;

                // Trigger the event and reset the late timer!
                VELOCITY_EVENTS[eventType].handler();
            }
        });
    }


    // TODO: If the same message attempt to be added twice and one is shorter, reduce its lifetime
    // Consider this a correction from Cooper/more recent data.
    static async addTempMessage(msg, deleteSecs) {
        if (msg.channel.type === 'dm') {
            console.log('not allowing temp message for dm atm', msg.content);
            return false;
        }

        let lifetimeSecs = !isNaN(parseInt(deleteSecs)) ? parseInt(deleteSecs) : 1;
        let expiry = Math.round((Date.now() / 1000) + lifetimeSecs);

        const messageLink = COOP.MESSAGES.link(msg);

        const query = {
            name: "add-temp-message",
            text: `INSERT INTO temp_messages(message_link, expiry_time) VALUES ($1, $2)
                ON CONFLICT (message_link)
                DO 
                UPDATE SET expiry_time = LEAST(temp_messages.expiry_time, EXCLUDED.expiry_time)
                RETURNING expiry_time`,
            values: [messageLink, expiry]
        };

        const result = await Database.query(query);
        return result;
    }

    static async deleteTempMsgLink(link) {
        const query = {
            name: "delete-temp-message-link",
            text: `DELETE FROM temp_messages WHERE message_link = $1`,
            values: [link]
        };
        

        const result = await Database.query(query);

        if (result && result.rowCount === 1) return true;
        else return false;
    }

    // TODO: Add types and log that a resource wasn't gathered.
    // TODO: Take the channel bulkDelete approach instead, may achieve better throttled results.

    static async getTempMsgs() {
        const query = {
            name: "get-temp-messages",
            text: `SELECT * FROM temp_messages 
                WHERE expiry_time <= extract(epoch from now())
                ORDER BY expiry_time ASC
                LIMIT 40`
        };
        
        const result = await Database.query(query);
        const tempMessages = DatabaseHelper.many(result);
        return tempMessages;
    }

    // Load and delete expired messages sorted by oldest first.
    static async processTempMessages() {
        // Load the temporary messages 
        const tempMessages = await this.getTempMsgs();

        // Build an object of deletions for bulk delete.
        const deletions = {};

        // Calculate from message links and batch the messages for bulkDeletion.
        const expiredMsgLinks = tempMessages.map(tempMsg => tempMsg.message_link);
        expiredMsgLinks.map(expiredMsgLink => {
            const messageData = COOP.MESSAGES.parselink(expiredMsgLink);
            if (messageData && messageData.channel) {
                // Start tracking the channel if it wasn't already.
                if (typeof deletions[messageData.channel] === 'undefined')
                    deletions[messageData.channel] = [];

                // Track the message which needs deleting too, include link in result array for confirmation.
                const deletionData = { 
                    messageID: messageData.message, 
                    link: expiredMsgLink 
                };
                deletions[messageData.channel].push(deletionData);
            }
        });

        // Decoupled deletion handled and pass the calculated deletions.
        this.cleanupTempMessages(deletions);
    }

    static async cleanupTempMessages(deletions) {
        const guildID = ServerHelper._coop().id;
        const msgUrlBase = `https://discordapp.com/channels/${guildID}`;
        
        // Iterate through the deletion data and bulkDelete for each channel.
        if (deletions) {
            Object.keys(deletions).map((deleteChanKey, index) => {
                setTimeout(async () => {
                    try {
                        // Load the channel for its bulkDelete method.
                        const chan = COOP.CHANNELS._get(deleteChanKey);
            
                        // Get the messages from this deletion channel.
                        const deletionItems = deletions[deleteChanKey];
    
                        // Format the data for discord API request.
                        const deletionMessageIDs = deletionItems.map(item => item.messageID);
                        
                        // Delete messages from discord.
                        const successfulDeletions = await chan.bulkDelete(deletionMessageIDs);
                                                
                        // On bulkDelete success, remove from our database.
                        successfulDeletions.map((item, id) => {
                            // Format the msg link from server ID, channel ID and message ID.
                            const msgUrl = `${msgUrlBase}/${chan.id}/${id}`;
        
                            // Remove record from temp messages table.
                            this.deleteTempMsgLink(msgUrl);
                        });
    
                    } catch(e) {
    
                        // If unknown message, it needs to attempt to be removed from database again.
                        if (e.path && e.path.includes('/messages/') && e.path.includes('/channels/')) {
                            // Need to do be very cautious this doesn't conflict or fail or even attempt on DMs...
                            const errorPathParts = e.path.split('/');
                            const prehandledMsgLink = `${msgUrlBase}/${errorPathParts[2]}/${errorPathParts[4]}`;
                            
                            // Delete a single prehandled/obstacle message.
                            this.deleteTempMsgLink(prehandledMsgLink);
                        }
    
                        // Ignore unknown messages.
                        if (e.message !== 'Unknown Message') {
                            console.log('Error cleaning up our temporary messages.');
                            console.error(e);
                        }
                    }
                }, 2222 * index);
            });
        }
    }
}