import Statistics from "./activity/information/statistics";
import { VELOCITY_EVENTS } from "./manifest";

// TODO: Refactor this as the main method for event timing... VELOCITY.
export default function serverTick() {
    const velocity = Statistics.calcCommunityVelocity();

    // Check each event to see if its late via velocity timings.
    Object.keys(VELOCITY_EVENTS).map(eventType => {
        // Seconds since last occurred.
        const absentSecs = VELOCITY_EVENTS[eventType].since += 30;

        // Desired interval for event type.
        const desiredInterval = VELOCITY_EVENTS[eventType].interval / 1000;

        // Desired interval adjusted for community velocity.
        const desiredVelInterval = desiredInterval / velocity;

        // If late, cause the event to be sped up. :)
        if (absentSecs >= desiredVelInterval) {
            // Reset time "since" (just occurred).
            VELOCITY_EVENTS[eventType].since = 0;

            // Trigger the event and reset the late timer!
            VELOCITY_EVENTS[eventType].handler();
        }
    });
}