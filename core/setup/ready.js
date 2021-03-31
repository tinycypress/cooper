import ElectionHelper from "../../community/features/hierarchy/election/electionHelper";
import AboutHelper from "../../community/features/server/aboutHelper";
import STATE from "../state";
import ServerHelper from "../entities/server/serverHelper";

export default async () => { 
    try {
        console.log(`Logged in as ${STATE.CLIENT.user.username}`); 
        
        // Prepare cache (avoid partials)!
        const guild = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        let reqNum = 0;
        guild.channels.cache.each(channel => {
            if (channel.type === 'text') {
                setTimeout(() => channel.messages.fetch({ limit: 5 }), 666 * reqNum);
                reqNum++;
            }
        });

        // TODO: Check if election is on before preloading.

            // Cache candidate messages (ONLY IF ITS ON, CHECK PLEASE)
            // Maybe rename to preloadIfNecessary()
            await ElectionHelper.onLoad();

        // Preload all about/options preferences options.
        await AboutHelper.preloadMesssages();

    } catch(e) {
        console.error(e);
    }

}
