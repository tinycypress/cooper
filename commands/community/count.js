import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import ServerHelper from '../../core/entities/server/serverHelper';
import EMOJIS from '../../core/config/emojis.json';

export default class CountCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'count',
			group: 'community',
			memberName: 'count',
			aliases: ['numusers', 'serversize', 'beaks'],
			description: 'Get the current member count',
			details: ``,
			examples: ['count', 'count example']
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			// Delete after sixty seconds.
            const emojiText = MessagesHelper.emojiText(EMOJIS.COOP);
            const userCount = ServerHelper._coop().memberCount || 0;
            const countText = `${userCount} #beaks presently in The Coop ${emojiText}!`;
			MessagesHelper.selfDestruct(msg, countText, 0, 20000);

		} catch(e) {
			console.error(e);
		}
    }
    
};