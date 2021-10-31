import { SERVER } from "../../origin/coop.mjs";
import Database from "../../origin/setup/database.mjs";

export default class ActivityHelper {

    static async track() {
        // Track activity
        const coop = await SERVER._coop().fetch();
        const active = coop.approximatePresenceCount;

        // Get the hour to assign it to.
        const date = new Date;
        const hour = date.getHours();

        return this.update(hour, active);
    }

    // Update the hourly average.
    static update(hour, activeNum) {
        return Database.query({
            name: 'update-hour-activity',
            text: 'UPDATE activity_hours SET active_num = $2 WHERE hour = $1',
            values: [hour, activeNum]
        }); 
    }

    static async peak() {
        // Calculate and return peak
    }

    static async prepeakOrCycleBegin() {
        // Calculate the cycle repeat beginning/start point for the day.
    }

}