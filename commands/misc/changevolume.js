import CoopCommand from '../../operations/activity/messages/coopCommand';
import { MESSAGES } from '../../origin/coop';
import ytdl from 'discord-ytdl-core';
import MusicHelper from '../../operations/misc/musicHelper';

export default class ChangeVolumeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'changevolume',
			group: 'misc',
			memberName: 'changevolume',
			aliases: [],
			description: 'Plays music by taking youtube links',
			examples: ['!changevolume', '!changevolume example?'],
			args: [
				{
					key: 'volume',
					type: 'float',
					prompt: 'What % volume change? 0 - 1.'
				}
			]
		});
	}

	async run(msg, { volume }) {
		super.run(msg);
		
		// Only let people in voice channels queue tracks.
		if (!msg.member.voice.channel) 
			return MESSAGES.selfDestruct(msg, 'You\'re not in a voice channel?');

		// Set the volume of the stream.
		MusicHelper.setVolume(volume);

		MESSAGES.selfDestruct(msg, 'Changed stream volume to ' + volume);
    }
    
}