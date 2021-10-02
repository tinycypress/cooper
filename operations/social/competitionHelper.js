import { CHANNELS } from "../../origin/coop";
import DatabaseHelper from "../databaseHelper";

export const COMPETITION_DUR = 1000 * 3600 * 24 * 7;

export default class CompetitionHelper {

    static async load() {
        const competitions = await DatabaseHelper.manyQuery({
            name: "get-event",
            text: `SELECT * FROM events WHERE event_code 
                IN ('technology_competition', 'art_competition', 'business_competition')`,
            });
        return competitions;
    }

    static async start(code) {
        console.log(code + ' start');
        CHANNELS._send('STREAM_NOMIC', code + ' start');
    }

    static async end(code) {
        console.log(code + ' end');
        CHANNELS._send('STREAM_NOMIC', code + ' end');
    }

    static async setActive(code, active) {
        return await DatabaseHelper.singleQuery({
            name: "update-event",
            text: 'UPDATE events SET active = $2 WHERE event_code = $1',
            values: [code, !!active]
        });
    }

    static async track() {
        const competitions = await this.load();
        const now = Date.now();

        // Initial count of running competitions.
        let numRunning = competitions.reduce(comp => comp.active ? 1 : 0, 0);

        console.log(numRunning);

        competitions.map(async comp => {
            // Check if active competition has expired.
            if (comp.active) {
                console.log('Competition active ' + comp.event_code);

                // Allow some time after competition has ran before starting another.
                const hasExpired = now - comp.last_occurred > COMPETITION_DUR;

                // Attempt to start a competition if required.
                if (hasExpired) {
                    // Handle competition announcements and channels.
                    await this.end(code);

                    // Make other checks aware this is starting and counted.
                    numRunning--;
                }

            // Check if inactive competition should start.
            } else {
                console.log('Competition inactive ' + comp.event_code);

                // Allow some time after competition has ran before starting another.
                const isDue = now - comp.last_occurred > (COMPETITION_DUR * 2);

                // Attempt to start a competition if required.
                if (isDue && numRunning < 2) {
                    // Handle competition announcements and channels.
                    await this.start(code);

                    // Make other checks aware this is starting and counted.
                    numRunning++;
                }

            }
        });
    }

}