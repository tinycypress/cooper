import ElectionHelper from '../../operations/members/hierarchy/election/electionHelper';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP from '../../origin/coop';
import { CHANNELS } from '../../origin/config';



export default class StandCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'stand',
			group: 'election',
			memberName: 'stand',
			aliases: [],
			description: 'Offer yourself as a potential leader/commander. Message has to be at least 30 characters and no more than 400.',
			examples: ['!stand <message>'],
			args: [
				{
					key: 'campaignText',
					prompt: 'Please provide your written electoral campaign message.',
					type: 'string',
				},
			],
		});
	}

	async run(msg, { campaignText }) {
		super.run(msg);

		// Prevent @everyone from idiots using it.
		if (campaignText.includes('@everyone')) {
			return COOP.MESSAGES.selfDestruct(msg, 'Warning: @ everyone not allowed.', 0, 5000);
		}
		else if (campaignText.includes('@')) {
			return COOP.MESSAGES.selfDestruct(msg, "Warning: @ is not allowed. Stand on your own or don't stand at all", 0, 5000);
		}

		try {
			// Prevent bad campaign texts.
			if (campaignText.length < 30) {
				// Send them a copy before deleting.
				msg.direct(`${msg.author.username} rewrite campaign message, not long enough.\n\n` + msg.content);
				return COOP.MESSAGES.selfDestruct(
					msg, 
					`${msg.author.username} rewrite campaign message, insufficient.`,
					0,
					7500
				);
			}


			if (campaignText.length > 400) {
				// Send them a copy before deleting.
				msg.direct(`${msg.author.username} rewrite campaign message, too long.\n\n` + msg.content);

				return COOP.MESSAGES.selfDestruct(
					msg, 
					`${msg.author.username} rewrite campaign message, too long.`,
					0,
					7500
				);
			}

			// Check if election is ongoing.
			const isElec = await ElectionHelper.isElectionOn();
	
			if (!isElec) {
				const nextElecFmt = await ElectionHelper.nextElecFmt();
				const noElecText = `There is no election currently ongoing. Next is ${nextElecFmt}!`;
				return COOP.MESSAGES.selfDestruct(msg, noElecText, 0, 7500);
			}
	
			
			if (isElec) {
				// Check if user is not already a candidate.
				const prevCandidate = await ElectionHelper.getCandidate(msg.author.id);
				if (!prevCandidate) {
					COOP.MESSAGES.selfDestruct(msg, `${msg.author.username}, you wanna stand for <#${CHANNELS.ELECTION.id}>, eyyy?`);

					const emojiText = COOP.MESSAGES.emojiCodeText('ELECTION_CROWN');
					const electionEmbed = COOP.MESSAGES.embed({ 
						title: `Election Event: ${msg.author.username} stands for election!`,
						description: `${msg.content}\n\n` +
							`To vote for <@${msg.author.id}> press (react) the crown emoji ${emojiText}.`,
						thumbnail: COOP.USERS.avatar(msg.author)
					});

					const electionMsg = await COOP.CHANNELS._postToChannelCode('ELECTION', electionEmbed);

					const msgLink = COOP.MESSAGES.link(electionMsg);
	
					// Add candidate to election
					await ElectionHelper.addCandidate(msg.author.id, msgLink);
	
					// Post to feed
					const successfulCandidateText = `${msg.author.username} was put forward for <#${CHANNELS.ELECTION.id}>`;
					COOP.MESSAGES.selfDestruct(msg, successfulCandidateText);
					COOP.CHANNELS._postToFeed(successfulCandidateText);
					
					// Add coop emoji to campaign message and crown
					COOP.MESSAGES.delayReact(electionMsg, '👑', 666);
				} 
				// else {
					// // If is already, ask them if they want to replace their campaign text if current message.
					// const wannaEditMsg = await msg.say(`${msg.author.username}, react to change your campaign message?`);
					// // create awaitReaction
					// COOP.MESSAGES.delayReact(wannaEditMsg, '👑', 666);
					// COOP.MESSAGES.delayDelete(wannaEditMsg, 30000);
				// }
			}

		} catch(e) {
			console.error(e);
			console.log('!stand failed.');
		}
    }
    
}