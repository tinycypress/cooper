import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';

import { MESSAGES } from '../../origin/coop.mjs';

export default class TileCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'tile',
			group: 'conquest',
			memberName: 'tile',
			description: 'tile a tile/structure.',
			examples: ['tile', 'tile example'],
			args: [
				{
					key: 'tileID',
					type: 'string',
					prompt: 'Which id for the tile?',
					default: ''
				}
			]
		});
	}

	async run(msg) {
		super.run(msg);

		MESSAGES.silentSelfDestruct(msg, `Trying to receive tile details.`);
    }
    
}