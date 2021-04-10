import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE, SERVER, TIME } from '../../origin/coop';
import { EMOJIS } from '../../origin/config';

export default class ChristmasCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'christmas',
			group: 'misc',
			memberName: 'christmas',
			aliases: [],
			description: 'Information christmas our fine community!',
			details: `Details`,
			examples: ['christmas', 'christmas example?'],
			args: [
				{
					key: 'user',
					prompt: 'Who do you wish to give the item to? @ them.',
					type: 'user',
					default: null
				},
			],
			ownerOnly: true
		});
	}

	async run(msg, { user }) {
		super.run(msg);
		
		// const eggEmoji = COOP.MESSAGES.emojiText(EMOJIS.CHRISTMAS_EGG);
		// const coopEmoji = COOP.MESSAGES.emojiText(EMOJIS.COOP);
		// const msgText = `You were given a Christmas Egg ${eggEmoji} as a reward,` +
		// 	` thank you for being part of The Coop! ${coopEmoji}\n` +
		// 	`Merry Christmas, ${user.username}!`;

		// await COOP.ITEMS.add(user.id, 'CHRISTMAS_EGG', 1)
		// await COOP.USERS.directMSG(SERVER._coop(), user.id, msgText);
    }
    
}