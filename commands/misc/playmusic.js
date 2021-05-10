import CoopCommand from '../../operations/activity/messages/coopCommand';
import { MESSAGES } from '../../origin/coop';
import ytdl from 'ytdl-core';
import MusicHelper from '../../operations/misc/musicHelper';

export default class PlayMusicCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'playmusic',
			group: 'misc',
			memberName: 'playmusic',
			aliases: ['pm', 'pmusic'],
			description: 'Plays music by taking youtube links',
			examples: ['!playmusic <YT_LINK>', '!pm <YT_LINK>', '!playmusic example?'],
			args: [
				{
					key: 'link',
					type: 'string',
					prompt: ''
				}
			]
		});
	}

	async run(msg, { link }) {
		super.run(msg);
		
		// Only let people in voice channels queue tracks.
		if (!msg.member.voice.channel) 
			return MESSAGES.selfDestruct(msg, 'You\'re not in a voice channel?');

		// Check the link/validate
		if (!ytdl.validateURL(link))
			return MESSAGES.selfDestruct(msg, 'Cannot parse music link. Try another.');

		// Approve adding to queue - democratic?
		MusicHelper.QUEUE.push(link);

		// If the track we just queued is the only queue item, start playing.
		if (!MusicHelper.CURRENTLY_PLAYING) MusicHelper.playNext();
		else {
			// Indicate queueing success.
			const queueText = `Added your link to the queue.\n\n` 
				+ MusicHelper.QUEUE.map(l => `<${l}>`).join(', ') + '.';
			MESSAGES.selfDestruct(msg, queueText, 0, 10000);
		}
    }
    
}