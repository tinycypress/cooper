import ChannelsHelper from "../core/entities/channels/channelsHelper";
import STATE from "../core/state";

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
        return 1;
    }

    // Use this to calculate and update community velocity.
    // TODO: Drop rates command and velocity command for comparison.
    static offloadMessageStats(data) {
        // TODO: Count # messages
        // Bonus, if bigger author:messages ratio this is better((?))
        // Count # reactions
        // ChannelsHelper._postToChannelCode('TALK', 'Calculate community velocity? Based on? Messages, reactions, joins, boosts, missing any user-driven activity?')

        const velocityText = `Community velocity is ${this.calcCommunityVelocity()}.`
        ChannelsHelper._postToChannelCode('TALK', velocityText);
    }

}