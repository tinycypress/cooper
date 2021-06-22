import { MessageAttachment } from 'discord.js';
import CoopCommand from '../../operations/activity/messages/coopCommand';
import BaseHelper from '../../operations/minigames/medium/conquest/baseHelper';
import VisualisationHelper from '../../operations/minigames/medium/conquest/visualisationHelper';

import { MESSAGES, STATE, USERS } from '../../origin/coop';

export default class BaseCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'base',
			group: 'community',
			memberName: 'base',
			description: 'base a base/structure.',
			examples: ['base', 'base example'],
			args: [
				{
					key: 'baseID',
					type: 'string',
					prompt: 'Which id for the base?',
					default: ''
				}
			]
		});
	}

	async run(msg, { baseID }) {
		super.run(msg);
		
		const base = await BaseHelper.get(baseID);
		if (!base)
			MESSAGES.silentSelfDestruct(msg, 'There is no base on face id #' + baseID);

		const baseMsgText = `**Tile Details #${base.face_id}:**\n` +
			`Owner: ${USERS._id2username(base.owner_id)}\n` +
			`Age: ${base.created_at}`;

		// Sometimes include a video of their base.
		if (STATE.CHANCE.bool({ likelihood: 2.5 })) {
			await VisualisationHelper.record("https://www.thecoop.group/conquest/world?tile=" + baseID);
            msg.channel.send(new MessageAttachment('/tmp/video.webm'));
		}
			
		MESSAGES.silentSelfDestruct(msg, baseMsgText);
    }
    
}