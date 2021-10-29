import { STATE } from './origin/coop.mjs';
import Database from './origin/setup/database.mjs';

import client from './origin/setup/client.mjs';
import registerLogging from './origin/setup/logging.mjs';

import eventsManifest from './operations/manifest.mjs';

// Help debugging the ghost errors from promises/rejects.
process.on("unhandledRejection", e => {
    console.error(e);

    const errorMsg = e.message || null;
    if (errorMsg) {
        if (e.message.includes('No video id found')) return false;
    
        if (e.message === 'Client has encountered a connection error and is not queryable') {
            console.log('Exiting to restart database.');
            return process.exit();
        }
        
        console.error(e.message, e.reason);
    }
    
    console.log('UNHANDLED REJECTION ABOVE');
});

// Run the production bot.
bootstrap();

// Define the production bot.
export default async function bootstrap() {
    // Globalise the created client (extended Discordjs).
    const botClient = STATE.CLIENT = await client();

    // Connect to PostGres Database and attach event/error handlers.
    await Database.connect();

    // Login to Discord with the bot.
    await botClient.login(process.env.DISCORD_TOKEN);

    // Register community events.
    // eventsManifest(botClient);

    // Register logging, debugging, errors, etc.
    registerLogging(botClient);

    // Set activity.
    botClient.user.setActivity(`We need /help`, { type: 'WATCHING' });
}
