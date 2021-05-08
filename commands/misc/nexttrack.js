import CoopCommand from '../../operations/activity/messages/coopCommand';
import { MESSAGES } from '../../origin/coop';
import MusicHelper from '../../operations/misc/musicHelper';

export default class NextTrackCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'nexttrack',
			group: 'misc',
			memberName: 'nexttrack',
			aliases: ['skip', 'nxt'],
			description: 'Democratically skips',
			examples: ['!nexttrack']
		});
	}

	async run(msg) {
		super.run(msg);
		
		// Indicate queueing success.
		const skippedText = `Skipped ${MusicHelper.QUEUE[0]}` ;
		MESSAGES.selfDestruct(msg, skippedText, 0, 10000);

		// Handle the skippage.
		MusicHelper.playNext();
    }
    
}