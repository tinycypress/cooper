import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';
import { EMOJIS } from '../../origin/config';

export default class SuggestCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'suggest',
			group: 'community',
			memberName: 'suggest',
			aliases: ['suggestion'],
			description: 'suggests will always be granted at The Coop to those who ask for them.',
			details: `Details`,
			examples: ['suggest', 'suggest prefix'],
		});
	}

	async run(msg) {
		// Run as a coop command (clean up the original calling message)
		super.run(msg);

		if (msg.content.includes('@everyone') || msg.content.includes('@here'))
			return COOP.MESSAGES.selfDestruct(msg, 'Pinging via Cooper disallowed.');

        try {
			// Post in suggestions.
			const cleanedContent = msg.content.replace('!suggestion', '').replace('!suggest', '');
			const pollAcknowledgement = await COOP.CHANNELS._postToChannelCode('SUGGESTIONS', cleanedContent);

			// Add reactions for people to use.
			COOP.MESSAGES.delayReact(pollAcknowledgement, EMOJIS.POLL_FOR, 333);
			COOP.MESSAGES.delayReact(pollAcknowledgement, EMOJIS.POLL_AGAINST, 666);

			// Add intended for roadmap, add roadmap reaction for adding to roadmap.
			if (msg.content.toLowerCase().indexOf('roadmap') > -1) {
				COOP.MESSAGES.delayReact(pollAcknowledgement, EMOJIS.ROADMAP, 999);
			}
		
			// Send poll tracking link.
			await msg.direct(
				'I started your poll, track its progress with this link: ' + 
				COOP.MESSAGES.link(pollAcknowledgement) + 
				+ " \n\n\n " + " _ " + msg.content
			);

        } catch(err) {
			console.error(err);
        }
    }
    
}