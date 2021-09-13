import MessageNotifications from "./information/messageNotifications";

import introPostedHandler from "./welcome/introPosted";

import MessageSpamHelper from "./messages/messageSpamHelper";
import LinkPreviewFilter from "./messages/linkPreviewFilter";
import ConfessionHandler from "./messages/confessionHandler";
import MiscMessageHandlers from "./messages/miscMessageHandlers";

import SuggestionsHelper from "./suggestions/suggestionsHelper";
import SubscriptionHelper from "../marketing/newsletter/subscriptionHelper";

import KeyInfoPosted from "./messages/keyinfoPosted";


export default async function messageAddedHandler(msg) {  
    // Block Cooper from all he shouldn't be involved with.
    // Try to optimise channel specific ones/guard orders.

    // Encourage intro posts with a wave and coop emoji
    introPostedHandler(msg);

    // Detect it for leaders/commander.
    KeyInfoPosted.onMessage(msg);

    // Check if suggestion needs handling.
    SuggestionsHelper.onMessage(msg);

    // Add to message notification tracking for keeping people updated on where things are said.
    MessageNotifications.add(msg);

    // Handle reports to leaders.
    ConfessionHandler.onMessage(msg);
    
    // Add newsletter subscription handler/email accepter.
    SubscriptionHelper.onMessage(msg);

    // Miscelleanous jokes and responses.
    MiscMessageHandlers.onMessage(msg);

    // Suppress previews from links but add toggle react.
    LinkPreviewFilter.onMessage(msg);

    // Handle spammy messages from Commandojs and other sources.
    MessageSpamHelper.onMessage(msg);
}