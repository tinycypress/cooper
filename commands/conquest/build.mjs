import CoopCommand from '../../operations/activity/messages/coopCommand.mjs';

import { MESSAGES } from '../../origin/coop.mjs';

export default class BuildCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'build',
			group: 'conquest',
			memberName: 'build',
			aliases: ['b'],
			description: 'Build a base/structure.',
			details: ``,
			examples: ['build', 'build example'],
			args: [
				// {
				// 	key: 'structureCode',
				// 	type: 'string',
				// 	prompt: 'Which structure code to build?',
				// 	default: ''
				// },
				// {
				// 	key: 'tileNum',
				// 	type: 'string',
				// 	prompt: 'Tile number to build base at?',
				// 	default: ''
				// }
			]
		});
	}

	async run(msg) {
		super.run(msg);

		// Get player's current tile

		// Check if there is a base already there.

		const cp = MESSAGES.emojiCodeText('COOP_POINT');
		const steel = MESSAGES.emojiCodeText('STEEL_BAR');
		const wood = MESSAGES.emojiCodeText('WOOD');
		const iron = MESSAGES.emojiCodeText('IRON_BAR');

		MESSAGES.silentSelfDestruct(msg, 
			`**Who will be first to build their base? :D\n\n**` +

			`__Requirements__:\n` +
			`Crafting level 15\n` +
			`200 x ${cp} COOP_POINT\n` +
			`125 x ${wood} WOOD\n` +
			`50 x ${steel} STEEL_BAR\n` +
			`25 x ${iron} IRON_BAR`
		);


		// Start building the base.

		
    }
    
}