import { CHANNELS } from "../../origin/coop";
import DatabaseHelper from "../databaseHelper";
import EventsHelper from "../eventsHelper";

export const COMPETITION_DUR = 1000 * 3600 * 24 * 7;

export default class CompetitionHelper {

    static async load() {
        const competitions = await DatabaseHelper.manyQuery({
            name: "load-competitions",
            text: `SELECT * FROM events WHERE event_code 
                IN ('technology_competition', 'art_competition', 'business_competition')`,
            });
        return competitions;
    }

    static async start(code) {
        await EventsHelper.update(code, Date.now());
        await this.setActive(code, true);
        
        console.log(code + ' start');
        const msg = await CHANNELS._send(code.toUpperCase(), code + ' start');
        await this.setMessageID(code, msg);
    }

    static async end(code) {
        await EventsHelper.update(code, Date.now());
        await this.setActive(code, false);
        
        
        console.log(code + ' end');
        CHANNELS._send(code.toUpperCase(), code + ' end');
    }

    static async setActive(code, active) {
        return await DatabaseHelper.singleQuery({
            name: "set-competition-status",
            text: 'UPDATE events SET active = $2 WHERE event_code = $1',
            values: [code, !!active]
        });
    }

    static async setMessageID(code, msg) {
        return await DatabaseHelper.singleQuery({
            name: "set-competition-message",
            text: 'UPDATE events SET message_id = $2 WHERE event_code = $1',
            values: [code, msg.id]
        });
    }

    static async track() {
        const competitions = await this.load();
        const now = Date.now();

        // Initial count of running competitions.
        let numRunning = competitions.reduce(comp => comp.active ? 1 : 0, 0);

        competitions.map(async comp => {
            const compLastOccurred = parseInt(comp.last_occurred);

            console.log(comp);

            // Check if active competition has expired.
            if (comp.active) {
                // Allow some time after competition has ran before starting another.
                const hasExpired = now - compLastOccurred > COMPETITION_DUR;

                // Attempt to start a competition if required.
                if (hasExpired) {
                    // Handle competition announcements and channels.
                    await this.end(comp.event_code);

                    // Make other checks aware this is starting and counted.
                    numRunning--;
                }

            // Check if inactive competition should start.
            } else {
                // Allow some time after competition has ran before starting another.
                const isDue = now - compLastOccurred > (COMPETITION_DUR * 2);

                // Attempt to start a competition if required.
                if (isDue && numRunning < 2) {
                    // Handle competition announcements and channels.
                    await this.start(comp.event_code);

                    // Make other checks aware this is starting and counted.
                    numRunning++;
                }
            }
        });
    }

}