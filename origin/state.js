import { Chance } from "chance";

const STATE = {
    // The DiscordJS/Commando client.
    CLIENT: null,

    // Internal memory/ephemeral.
        // Message ephemeral state for tracking message updates/notifications
        MESSAGE_HISTORY: {},

        // Tracking events history related to economy/minigames.
        EVENTS_HISTORY: {},

    // State properties used for limiting/rate-limiting feedback messages.
        // Last redemption update time 
        LAST_ENTRY_VOTE_TIME: null,
        LAST_ACHIEVEMENT_NOTIFICATION: null,

        // Server economy/game buffs:
        BUFFS: {},

    // Chance/random instance
    CHANCE: new Chance,

    // The economy reserve wallet
    WALLET: null,
};
export default STATE;