import Client from 'pg/lib/client.js';
import { CHANNELS } from '../coop.mjs';

export default class Database {

    static connection = null;

    static async connect() {
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
              rejectUnauthorized: false
            }
        });
          
        await client.connect();

        client.on('error', e => {
            console.error(e);

            // Detect connection severed and restart.
            console.log(e.message, e.reason);
            if (e.message.includes('is not queryable')) {
                console.log('Lost database connection');
                CHANNELS._tempSend('TALK', 'Seppuku?');
                // process.exit()
            }
        });

        this.connection = client;
    }

    static query(query) {
        return this.connection.query(query);
    }
}