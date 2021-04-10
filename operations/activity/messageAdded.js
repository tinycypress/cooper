import MessageNotifications from "./information/messageNotifications";


import workPostHandler from "./encouragement/workPosted";
import achievementPostedHandler from "./encouragement/achievementPosted";
import introPostedHandler from "./welcome/introPosted";


import MessageSpamHelper from "./messages/messageSpamHelper";
import LinkPreviewFilter from "./messages/linkPreviewFilter";
import ConfessionHandler from "./messages/confessionHandler";
import MiscMessageHandlers from "./messages/miscMessageHandlers";


import SuggestionsHelper from "./suggestions/suggestionsHelper";
import SubscriptionHelper from "../marketing/newsletter/subscriptionHelper";

import { CHANNELS } from "../../origin/config";


export default async function messageAddedHandler(msg) {  

    // Encourage posters in show work channel.
    if (msg.channel.id === CHANNELS.SHOWWORK.id) workPostHandler(msg);

    // Encourage achievement posters
    if (msg.channel.id === CHANNELS.ACHIEVEMENTS.id) achievementPostedHandler(msg);

    // Encourage intro posts with a wave and coop emoji
    if (msg.channel.id === CHANNELS.INTRO.id) introPostedHandler(msg);

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


    // SPAMREFORM: KILL COMMANDOJS MESSAGES:
    MessageSpamHelper.onMessage(msg);
}