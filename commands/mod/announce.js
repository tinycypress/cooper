import CoopCommand from '../../core/entities/coopCommand';


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
			// const emojiText = MessagesHelper._displayEmojiCode('EASTER_EGG');
			// const announceText = `@everyone, collect our limited edition ${emojiText}${emojiText} easter egg for easter! Happy Easter.`;        
			// const announceMsg = await ChannelsHelper._postToChannelCode('KEY_INFO', announceText);
			// MessagesHelper.delayReact(announceMsg, EMOJIS.COOP, 333);

		} catch(e) {
			console.error(e);
		}

    }
    
};