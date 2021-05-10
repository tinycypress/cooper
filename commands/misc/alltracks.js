import CoopCommand from '../../operations/activity/messages/coopCommand';
import { MESSAGES } from '../../origin/coop';
import MusicHelper from '../../operations/misc/musicHelper';

export default class AllTracksCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'alltracks',
			group: 'misc',
			memberName: 'alltracks',
			description: 'Shows the stream track queue',
			examples: ['!alltracks']
		});
	}

	async run(msg) {
		super.run(msg);
		
		// Indicate queueing success.
		const tracksString = MusicHelper.QUEUE.map(l => `<${l}>`).join(', ');
		const queueText = `**Queued tracks:**\n\n` +
			MusicHelper.QUEUE.length > 0 ? `${tracksString}.` : 'No queued tracks currently.';
			
		MESSAGES.selfDestruct(msg, queueText, 0, 10000);
    }
    
}