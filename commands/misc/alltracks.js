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
		
		console.log('Testing all tracks');
		
		// Indicate queueing success.
		const queue = MusicHelper.QUEUE;
		console.log(queue);
		
		const queueText = `**Queued tracks:**\n\n` +
			(queue.length >= 0 ? 
				`${queue.map(l => `<${l}>`).join(', ')}.` 
				: 
				'No queued tracks currently.'
			);

			
		MESSAGES.selfDestruct(msg, queueText, 0, 10000);
    }
    
}