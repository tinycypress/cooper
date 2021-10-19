import { MessageAttachment } from 'discord.js';
import CoopCommand from '../../operations/activity/messages/coopCommand';
import BaseHelper from '../../operations/minigames/medium/conquest/baseHelper';
import VisualisationHelper from '../../operations/minigames/medium/conquest/visualisationHelper';

import { MESSAGES, STATE, USERS } from '../../origin/coop';

export default class MilaBaseCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'milabase',
			group: 'community',
			memberName: 'milabase',
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
			return MESSAGES.silentSelfDestruct(msg, 'There is no base on face id #' + baseID);

		const link = "https://www.thecoop.group/conquest/world?tile=" + baseID;

		const baseMsgText = `**Tile Details #${base.face_id}:**\n` +
			`Owner: ${USERS._id2username(base.owner_id)}\n` +
			`Age: ${base.created_at}\n\n

			${link}
		`;

		// Sometimes include a video of their base.
		MESSAGES.silentSelfDestruct(msg, 'Loading a visual for your base, please wait.');
		await VisualisationHelper.record(link, 10000);
		msg.channel.send(baseMsgText, new MessageAttachment('/tmp/video.webm'));
    }
    
}