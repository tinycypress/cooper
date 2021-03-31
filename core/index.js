import BlockIO from 'block_io';
import CDNManager from './setup/cdn';
import Database from './setup/database';

import client from './setup/client';
import registerLogging from './setup/logging';

// Feature/abstract usage.
import registerCommunityEvents from '../community/events/eventsManifest';

// Singleton state accessor
import STATE from './state';


// Run the production bot.
bootstrap();


// Define the production bot.
export default async function bootstrap() {
    // Globalise the created client (extended Discordjs).
    const botClient = STATE.CLIENT = client();

    // Setup the bot wallet for economy reserves.
    STATE.WALLET = new BlockIO(process.env.BITCOIN_APIKEY, process.env.WALLET_PIN);

    // Connect to PostGres Database
    await Database.connect();

    // Login to Discord with the bot.
    await botClient.login(process.env.DISCORD_TOKEN);

    // Register community events.
    registerCommunityEvents(botClient);

    // Register logging, debugging, errors, etc.
    registerLogging(botClient);

    // Start basic CDN
    await CDNManager.start();

    // Set activity.
    botClient.user.setActivity('🍖🍖 SPAM REFORM 2025 🍖🍖', { type: 'WATCHING' });
}