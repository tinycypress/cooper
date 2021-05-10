import CoopCommand from '../../operations/activity/messages/coopCommand';
import { MESSAGES } from '../../origin/coop';
import MusicHelper from '../../operations/misc/musicHelper';

export default class ResumeMusicCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'resumemusic',
			group: 'misc',
			memberName: 'resumemusic',
			description: 'Resumes stream'
		});
	}

	async run(msg) {
		super.run(msg);
		
		// Only let people in voice channels queue tracks.
		if (!msg.member.voice.channel) 
			return MESSAGES.selfDestruct(msg, 'You\'re not in a voice channel?');

		// Approve pausing - democratic?
		MusicHelper.resume();
		MESSAGES.selfDestruct(msg, 'Stream resumed.');
    }
    
}