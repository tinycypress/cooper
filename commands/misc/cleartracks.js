import CoopCommand from '../../operations/activity/messages/coopCommand';
import { MESSAGES } from '../../origin/coop';
import MusicHelper from '../../operations/misc/musicHelper';

export default class ClearTracksCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'cleartracks',
			group: 'misc',
			memberName: 'cleartracks',
			description: 'Clears all tracks',
			examples: ['!cleartracks']
		});
	}

	async run(msg) {
		super.run(msg);
		
		// Indicate queueing success.
		const clearTracksText = `Clearing all tracks.` ;
		MESSAGES.selfDestruct(msg, clearTracksText, 0, 10000);

		// Handle the skippage.
		MusicHelper.QUEUE = [];
    }
    
}