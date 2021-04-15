import CoopCommand from '../../operations/activity/messages/coopCommand';

import { MESSAGES } from '../../origin/coop';

// Filter for a valid confirmation.
const proceedfeedbackReactFilter = ({ emoji }, user) => 
		user.id === msg.author.id && emoji.name == '👍';

// Recursive confirmation prompt.
const confirmationPrompt = async function(text, callback) {
	// Step 5: Loop through different tutorial lessons.
	const promptMsg = this.say(text);
	MESSAGES.delayReact(promptMsg, '👍', 222);

	const promptReactions = await promptMsg.awaitReactions(
		proceedfeedbackReactFilter, 
		{ max: 1, time: 30000 }
	);
	const firstReaction = promptReactions.first().emoji.name;
	if (firstReaction === '👍') callback.bind(promptMsg)();
}

export default class TutorialCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'tutorial',
			group: 'community',
			memberName: 'tutorial',
			aliases: ['tut'],
			description: 'Start The Coop tutorial',
			details: ``,
			examples: ['tutorial', 'tutorial example']
		});
	}

	// Step 1: User types !tutorial or !tut
	async run(msg) {
		super.run(msg);
		
		// Step 4: Listen for reaction on start tutorial message.
		confirmationPrompt.bind(msg)(`${msg.author.username}, *message*`,
			confirmationPrompt(`${msg.author.username}, *message two*`,
			confirmationPrompt(`${msg.author.username}, *message three*`,
			confirmationPrompt(`${msg.author.username}, *message four*`,
		))));
	}
}
