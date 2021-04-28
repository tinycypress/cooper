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
}
