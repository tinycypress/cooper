import CoopCommand from '../../operations/activity/messages/coopCommand';
import { MESSAGES } from '../../origin/coop';
import MusicHelper from '../../operations/misc/musicHelper';

export default class MuzzleCooperCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'muzzlecooper',
			group: 'misc',
			memberName: 'muzzlecooper',
			description: 'Evicts Cooper from voice channel',
			examples: ['!muzzlecooper']
		});
	}

	async run(msg) {
		super.run(msg);
		
		// Evict Cooper.
		CHANNELS._getCode('STREAM_ACTUAL').join()
			.then(conn => conn.disconnect());

		// Indicate queueing success.
		const muzzlingText = `Evicting Cooper from voice.` ;
		MESSAGES.selfDestruct(msg, muzzlingText, 0, 10000);
    }
    
}