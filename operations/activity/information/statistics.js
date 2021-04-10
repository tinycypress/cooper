import MessageNotifications from "./messageNotifications";

import ServerHelper from "../../serverHelper";

import STATE from "../../../origin/state";

import COOP from "../../../origin/coop";

export default class Statistics {

    // Run on an interval to store server statistics.
    static processMemoryIntoStatistics() {
        // STATE.EVENTS_HISTORY
        // STATE.BOOST_HISTORY
        // STATE.JOIN_HISTORY

        // damage inflicted/items used/items crafted/items destroyed

        // STATE.MESSAGE_HISTORY
        // STATE.REACTION_HISTORY
    }

    static calcCommunityVelocity() {
        let velocity = 1;

        // Calculate the number of current users to adjust ratios.
        const numUsers = ServerHelper._count();

        // Add score of messages (1 per message).
        const totalMsgs = MessageNotifications.getFreshMsgTotalCount();
        const beakAverage = totalMsgs / numUsers;
        const msgPerBeak = isNaN(beakAverage) ? 0 : beakAverage;

        const activeChannels = Object.keys(STATE.MESSAGE_HISTORY);
        const channelAverage = msgPerBeak / activeChannels.length;
        const msgPerChannel = isNaN(channelAverage) ? 0 : channelAverage;

        // Calculate the number of active talkers adjusted for average.
        const activeMessagers = activeChannels.reduce((acc, channelID) => {
            const authors = STATE.MESSAGE_HISTORY[channelID].authors;
            const numUsers = Object.keys(authors).length;
            return acc += numUsers / numUsers;
        }, 0);

        // TODO: Adjust / little bonus for more active messagers.
        velocity += activeMessagers;

        // Add velocity for the channel activity.
        velocity += msgPerChannel;

        return velocity;
    }

    // Use this to calculate and update community velocity.
    // TODO: Drop rates command and velocity command for comparison.
    static offloadMessageStats() {
        // TODO: Count # messages
        // Bonus, if bigger author:messages ratio this is better((?))
        // Count # reactions
        // COOP.CHANNELS._postToChannelCode('TALK', 'Calculate community velocity? Based on? Messages, reactions, joins, boosts, missing any user-driven activity?')


        // If community velocity is higher than record, reward community
        // A rare crate, bonus eggs, etc.

        const velocityText = `Community velocity is ${this.calcCommunityVelocity()}.`
        COOP.CHANNELS._postToChannelCode('TALK', velocityText);
    }

}