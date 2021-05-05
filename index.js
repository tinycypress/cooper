import BlockIO from 'block_io';
import CDNManager from './origin/setup/cdn';
import Database from './origin/setup/database';

import client from './origin/setup/client';
import registerLogging from './origin/setup/logging';

// Feature/abstract usage.
import eventsManifest from './operations/manifest';

// Singleton state accessor
import { STATE, CHANNELS } from './origin/coop';
import MusicHelper from './operations/misc/musicHelper';


// Help debugging the ghost errors from promises/rejects.
process.on("unhandledRejection", console.error);

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
    eventsManifest(botClient);

    // Register logging, debugging, errors, etc.
    registerLogging(botClient);

    // Start basic CDN
    await CDNManager.start();

    // Set activity.
    // const items = UsableItemHelper.getUsableItems();
    // const randomItem = STATE.CHANCE.pickone(items);
    // const itemEmoji = MESSAGES.emojiCodeText(randomItem);
    botClient.user.setActivity(`!help... STRUCTURE REFORM`, { type: 'WATCHING' });


    // Connect to the music stream.
    MusicHelper.connect();
}