import { TIME } from "../../../origin/coop";

export default class ProjectsHelper {

    // TODO: Create !newproject command to help feed the suggestion correct format.
    // NOTE: Allow user to use an emoji on cooper to create new project?

    static async createChannel() {
        // Create the channel under projects.
        // CHANNELS._create()

        // Set the owner and their permissons

        // Try to parse description, deadline, name

        // Apply meta info to the channel

        // Mentions of access or PUBLIC keyword

        // Add the channel to the database.
    }

    static isSuggestionProjectReq(msg) {
        
    }

    static isValidDeadline(deadline) {
        // Take human readable due time.
		const dueDate = TIME.parseHuman(deadline);

		// Invalid input time feedback
		if (isNaN(dueDate)) return false;

		// Calculate unix secs for due/deadline.
		const dueSecs = Math.round(dueDate.getTime() / 1000);

		// Prevent too long of a deadline.
		if (dueSecs >= TIME._secs() + 3.154e+7) return false;

        // Valid
        return true;
    }
}


// Revenue opportunities:
// GOLD_COIN payments for egg drops/minigames consideration of channel
// GOLD_COIN payments for visibilty
// GOLD_COIN to prevent being archived / deleted



// export const PROJECT_ARGS_MSG_ORDER = [
//     'name', 'deadline', 'description', 'visibility'
// ];

// Default deadline to 1 week in seconds
// const weekSecs = ((60 * 60) * 24) * 7;
// export const DEFAULT_PROJECT_OPTS = {
//     name: 'unknown',
//     description: 'unknown',
//     deadline: weekSecs,
//     visibility: 'PRIVATE'
// };