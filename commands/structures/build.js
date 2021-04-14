import CoopCommand from '../../operations/activity/messages/coopCommand';

import COOP, { ITEMS, MESSAGES, SERVER } from '../../origin/coop';
import { EMOJIS } from '../../origin/config';
import Statistics from '../../operations/activity/information/statistics';

export default class BuildCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'build',
			group: 'community',
			memberName: 'build',
			aliases: ['b'],
			description: 'Build a base/structure.',
			details: ``,
			examples: ['build', 'build example']
		});
	}

	async run(msg) {
		super.run(msg);

		const cp = MESSAGES._displayEmojiCode('COOP_POINT');
		const steel = MESSAGES._displayEmojiCode('STEEL_BAR');
		const wood = MESSAGES._displayEmojiCode('WOOD');
		const iron = MESSAGES._displayEmojiCode('IRON_BAR');

		MESSAGES.silentSelfDestruct(msg, 
			`**Who will be first to build their base? :D\n\n**` +

			`__Requirements__:\n` +
			`Crafting level 15\n` +
			`200 x ${cp} COOP_POINT\n` +
			`125 x ${wood} WOOD\n` +
			`50 x ${steel} STEEL_BAR\n` +
			`25 x ${iron} IRON_BAR`
		);

		
    }
    
}