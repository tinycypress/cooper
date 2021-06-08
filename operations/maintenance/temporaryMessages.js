import { CHANNELS, MESSAGES, SERVER } from "../../origin/coop";
import Database from "../../origin/setup/database";
import DatabaseHelper from "../databaseHelper";

// TODO: If current version cannot be fixed - fall back to this.
export default class TemporaryMessages {
    remove() {}
    has() {}
    flush() {}

    // TODO: If the same message attempt to be added twice and one is shorter, reduce its lifetime
    // Consider this a correction from Cooper/more recent data.
    static async add(msg, deleteSecs = 60 * 5, note, data) {
        if (msg.channel.type === 'dm') return false;

        let lifetimeSecs = !isNaN(parseInt(deleteSecs)) ? parseInt(deleteSecs) : 1;
        let expiry = Math.round((Date.now() / 1000) + lifetimeSecs);

        const messageLink = MESSAGES.link(msg);

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

    static async deleteByLink(link) {
        const query = {
            name: "delete-temp-message-link",
            text: `DELETE FROM temp_messages WHERE message_link = $1`,
            values: [link]
        };
        
        // TODO: Create a databaseDelete method that uses below code.

        // Confirm one successful row delete.
        const delRowCount = (await Database.query(query)).rowCount || 0;
        return !!delRowCount;
    }



    // TODO: Add types and log that a resource wasn't gathered.
    // TODO: Take the channel bulkDelete approach instead, may achieve better throttled results.

    static async getExpiredTempMessages() {
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

    static async getTempMessageByLink(link) {
        const query = {
            name: "get-temp-message",
            text: `SELECT * FROM temp_messages WHERE message_link = $1`,
            values: [link]
        };
        
        const result = await Database.query(query);
        const tempMessage = DatabaseHelper.single(result);
        return tempMessage;
    }

    // Load and delete expired messages sorted by oldest first.
    static async processTempMessages() {
        // Load the temporary messages 
        const tempMessages = await this.getExpiredTempMessages();

        // Build an object of deletions for bulk delete.
        const deletions = {};

        // Calculate from message links and batch the messages for bulkDeletion.
        const expiredMsgLinks = tempMessages.map(tempMsg => tempMsg.message_link);
        expiredMsgLinks.map(expiredMsgLink => {
            const messageData = MESSAGES.parselink(expiredMsgLink);
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
        const guildID = SERVER._coop().id;
        const msgUrlBase = `https://discordapp.com/channels/${guildID}`;
        
        // Iterate through the deletion data and bulkDelete for each channel.
        if (deletions) {
            Object.keys(deletions).map((deleteChanKey, index) => {
                setTimeout(async () => {
                    try {
                        // Load the channel for its bulkDelete method.
                        const chan = CHANNELS._get(deleteChanKey);

                        // Get the messages from this deletion channel.
                        const deletionItems = deletions[deleteChanKey];
    
                        // Format the data for discord API request.
                        const deletionMessageIDs = deletionItems.map(item => item.messageID);

                        const existentDeletionMessageIDs = await deletionMessageIDs.filter(async item => {
                            // If it's in cache, don't check at all.
                            const cachedMsg = chan.messages.get(item.messageID);
                            if (cachedMsg && !cachedMsg.deleted)
                                return true;

                            const stillExist = await chan.messages.fetch(item.messageID);
                            if (!stillExist) {
                                // Remove record from temp messages table.
                                this.deleteByLink(`${msgUrlBase}/${chan.id}/${item.messageID}`);
                                return false;
                            }
                            return true;
                        });
                        
                        // Delete messages from discord.
                        const successfulDeletions = await chan.bulkDelete(existentDeletionMessageIDs);
                                                
                        // On bulkDelete success, remove from our database.
                        successfulDeletions.map((item, id) => {
                            // Format the msg link from server ID, channel ID and message ID.
                            const msgUrl = `${msgUrlBase}/${chan.id}/${id}`;
        
                            // Remove record from temp messages table.
                            this.deleteByLink(msgUrl);
                        });
    
                    } catch(e) {
    
                        // If unknown message, it needs to attempt to be removed from database again.
                        if (e.path && e.path.includes('/messages/') && e.path.includes('/channels/')) {
                            // Need to do be very cautious this doesn't conflict or fail or even attempt on DMs...
                            const errorPathParts = e.path.split('/');
                            const prehandledMsgLink = `${msgUrlBase}/${errorPathParts[2]}/${errorPathParts[4]}`;
                            
                            // Delete a single prehandled/obstacle message.
                            this.deleteByLink(prehandledMsgLink);
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