import CoopCommand from '../../operations/activity/messages/coopCommand';
import { MESSAGES } from '../../origin/coop';
import ytdl from 'discord-ytdl-core';
import MusicHelper from '../../operations/misc/musicHelper';

export default class PlayMusicCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'playmusic',
			group: 'misc',
			memberName: 'playmusic',
			aliases: ['pm', 'pmusic'],
			description: 'Plays music by taking youtube links',
			examples: ['!playmusic', '!playmusic example?'],
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

		// TODO: Handle loading errors?

		// Load
		const track = MusicHelper.load(link);

		// Approve adding to queue - democratic?

		// Play
		MusicHelper.play(track);
    }
    
}