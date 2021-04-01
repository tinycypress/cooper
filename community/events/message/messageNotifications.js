import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import UsersHelper from "../../../core/entities/users/usersHelper";
import STATE from "../../../core/state";
import CHANNELS from '../../../core/config/channels.json';
import KEY_MESSAGES from '../../../core/config/keymessages.json';
import MessagesHelper from "../../../core/entities/messages/messagesHelper";
import Chicken from "../../chicken";
import TimeHelper from "../../features/server/timeHelper";
import Statistics from "../../statistics";

export default class MessageNotifications {

    static add(msg) {
        const channelID = msg.channel.id;
        const authorID = msg.author.id;

        // Filter out Cooper's messages.
        if (UsersHelper.isCooperMsg(msg)) return false;

        // Filter out direct message and testing.
        // if (channelID === CHANNELS.COOPERTESTS.id) return false;

        // Filter out DM messages.
        if (msg.channel.type === 'dm') return false;

        // If not already tracking, create the key on the object.
        if (typeof STATE.MESSAGE_HISTORY[channelID] === 'undefined') {
            STATE.MESSAGE_HISTORY[channelID] = {
                count: 0,
                authors: {}
            };
        }

        // If not already tracking messages for that author on that object, initialise.
        if (typeof STATE.MESSAGE_HISTORY[channelID].authors[authorID] === 'undefined') {
            STATE.MESSAGE_HISTORY[channelID].authors[authorID] = {
                count: 0,
                username: msg.author.username
            };
        }

        // Add count on channel and author to list.
        STATE.MESSAGE_HISTORY[channelID].count++;
        STATE.MESSAGE_HISTORY[channelID].authors[authorID].count++;
    }

    // TODO: These messages should be added to a global statistics store... quite significant stats.
    static process() {
        // Offload message data to processing/long-term statistics before deletion.
        Statistics.offloadMessageStats(STATE.MESSAGE_HISTORY);

        // Post to community.
        this.post();
    }

    static post() {
        const notificationChannelIDs = Object.keys(STATE.MESSAGE_HISTORY);
        if (notificationChannelIDs.length > 0) {
            // Count total messages beforehand to add to string as header.
            const totalCount = notificationChannelIDs.reduce((acc, val) => {
                acc += STATE.MESSAGE_HISTORY[val].count;
                return acc;
            }, 0);
            
            // TODO: Order by most messages.
            let notificationString = `**${totalCount} latest messages!**\n\n`;
            
            notificationChannelIDs.map(channelID => {
                // Access the notification data for this specific channel.
                const notificationData = STATE.MESSAGE_HISTORY[channelID];

                // Add formatted string for posting as notification.
                const label = notificationData.count > 1 ? 'messages' : 'message';
                notificationString += `<#${channelID}> ${notificationData.count} ${label}! \n` +
                    `From: ${Object.keys(notificationData.authors).map(authorKey => {
                        const { username, count } = notificationData.authors[authorKey];
                        return `${username} (${count})`;
                    }).join(', ')}`;

                // Add some line spacing.
                notificationString += '\n\n';


                // Update the last message time and total messages count of these users.
                Object.keys(notificationData.authors).map(async (authorKey) => {
                    const count = notificationData.authors[authorKey].count;

                    // Update last message secs to current time.
                    UsersHelper.updateField(authorKey, 'last_msg_secs', TimeHelper._secs());

                    // TODO: Improve with more efficient postgres method UsersHelper.add() like Items.

                    // Update total_msgs field for the user.
                    const newTotal = (await UsersHelper.getField(authorKey, 'total_msgs')) + count;
                    UsersHelper.updateField(authorKey, 'total_msgs', newTotal);
                });

                // All outstanding state accounted for, cleanup.
                this.clear(channelID);
            });

            // Edit the message in about channel.
            MessagesHelper.editByLink(KEY_MESSAGES.latest_messages, notificationString);
            ChannelsHelper._postToFeed(notificationString, 4444);
        }
    }
    

    static clear(channelID) {
        delete STATE.MESSAGE_HISTORY[channelID];
    }
}