import STATE from "../state";
import ready from "./ready";

export default () => {

    STATE.CLIENT

        // Currently overly verbose debugging.
        .on('error', console.error)
        .on('warn', console.warn)
        // .on('debug', console.log)

        // Connection notifiers.
        .on('disconnect', () => console.warn('Disconnected!'))
        .on('reconnecting', () => console.warn('Reconnecting...'))

        // Add on ready handler to application/discordjs dep.
        .on('ready', ready);

    // TODO: Add a custom heartbeat?

    // TODO: Track the election IDs or numbers, which one we are on :D
    // TODO: Add a more useful/helpful time to DURING ELECTION messages/text
    // It is currently an election and I can't tell how long is left on eitheR:
        // election message top message
        // !nextelec 
        // !votingtime (only returns "a day remaining" ambiguous)
}
