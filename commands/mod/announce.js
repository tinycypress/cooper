 import CoopCommand from '../../operations/activity/messages/coopCommand';


export default class AnnounceCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'announce',
			group: 'mod',
			memberName: 'announce',
			aliases: [],
			description: 'Information announce our fine community!',
			details: `Details`,
			examples: ['announce', 'announce example?'],

			// Stop us getting nuked
			ownerOnly: true,
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			// TODO: REFACTOR THIS TO AN ANNOUNCE COMMAND, GUARDED TO LEADERSHIP.
			// const emojiText = COOP.MESSAGES._displayEmojiCode('EASTER_EGG');
			// const announceText = `@everyone, collect our limited edition ${emojiText}${emojiText} easter egg for easter! Happy Easter.`;        
			// const announceMsg = await COOP.CHANNELS._postToChannelCode('KEY_INFO', announceText);
			// COOP.MESSAGES.delayReact(announceMsg, EMOJIS.COOP, 333);

		} catch(e) {
			console.error(e);
		}

    }
    
}