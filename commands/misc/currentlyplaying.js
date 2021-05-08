import CoopCommand from '../../operations/activity/messages/coopCommand';
import { MESSAGES } from '../../origin/coop';
import MusicHelper from '../../operations/misc/musicHelper';

export default class CurrentlyPlayingCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'currentlyplaying',
			group: 'misc',
			memberName: 'currentlyplaying',
			aliases: ['current', 'isplaying', 'tracktitle'],
			description: 'Returns current streaming link',
			examples: ['!currentlyplaying']
		});
	}

	async run(msg) {
		super.run(msg);
		
		if (MusicHelper.QUEUE.length <= 0) {
			// Indicate queueing success.
			const noTrackText = `No tracks currently queued. !pm <link> to add to queue.` ;
			MESSAGES.selfDestruct(msg, noTrackText, 0, 10000);
		} else {
			// Indicate queueing success.
			const currentPlayingText = `Currently playing: ${MusicHelper.CURRENTLY_PLAYING}` ;
			MESSAGES.selfDestruct(msg, currentPlayingText, 0, 10000);
		}

    }
    
}