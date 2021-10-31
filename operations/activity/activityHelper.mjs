import { SERVER } from "../../origin/coop.mjs";

export default class ActivityHelper {

    static async track() {
        // Track activity
        const coop = await SERVER._coop().fetch();
        const active = coop.approximatePresenceCount;

        // Get the hour to assign it to.
        const date = new Date;
        console.log(date.getHours());
        console.log(active);
    }

    static async update(hour, activeNum) {
        
    }

    static async peak() {
        // Calculate and return peak
    }

    static async prepeakOrCycleBegin() {
        // Calculate the cycle repeat beginning/start point for the day.
    }

}