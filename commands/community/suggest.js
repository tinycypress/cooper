import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USERS } from '../../origin/coop';
import { EMOJIS } from '../../origin/config';
import SuggestionsHelper from '../../operations/activity/suggestions/suggestionsHelper';

export default class SuggestCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'suggest',
			group: 'community',
			memberName: 'suggest',
			aliases: ['suggestion'],
			description: 'Allows you to suggest Coop related changes to the #suggest channel.',
			examples: ['!suggest <suggestion>', '!suggest update The Coop blog biweekly'],
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

			// Detect attempts to suggest PROJECT_CHANNEL
			if (msg.content.toLowerCase().includes('project channel')) {
				// If needs an owner to give the project channel to.
			}

			// Add reactions for people to use.
			SuggestionsHelper.activateSuggestion(pollAcknowledgement);

			// Add intended for roadmap, add roadmap reaction for adding to roadmap.
			if (msg.content.toLowerCase().indexOf('roadmap') > -1)
				COOP.MESSAGES.delayReact(pollAcknowledgement, EMOJIS.ROADMAP, 999);
		
			// Send poll tracking link.
			USERS._dm(msg.author.id, 
				'I started your poll, track its progress with this link: ' + 
				COOP.MESSAGES.link(pollAcknowledgement) + 
				+ " \n\n\n " + " _ " + msg.content
			);

        } catch(err) {
			console.error(err);
        }
    }
    
}