import CoopCommand from '../../core/entities/coopCommand';

import CHANNELS from '../../core/config/channels.json';
import EMOJIS from '../../core/config/emojis.json';

import ElectionHelper from '../../community/features/hierarchy/election/electionHelper';
import ChannelsHelper from '../../core/entities/channels/channelsHelper';
import MessagesHelper from '../../core/entities/messages/messagesHelper';


import UsersHelper from '../../core/entities/users/usersHelper';



export default class StandCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'stand',
			group: 'election',
			memberName: 'stand',
			aliases: [],
			description: 'Offer yourself as a potential leader/commander.',
			details: ``,
			examples: ['stand', '!stand {?message?}'],
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
			return MessagesHelper.selfDestruct(msg, 'Warning: @ everyone not allowed.', 0, 5000);
		}
		else if (campaignText.includes('@')) {
			return MessagesHelper.selfDestruct(msg, "Warning: @ is not allowed. Stand on your own or don't stand at all", 0, 5000);
		}

		try {
			// Prevent bad campaign texts.
			if (campaignText.length < 30) {
				// Send them a copy before deleting.
				msg.direct(`${msg.author.username} rewrite campaign message, not long enough.\n\n` + msg.content);
				return MessagesHelper.selfDestruct(
					msg, 
					`${msg.author.username} rewrite campaign message, insufficient.`,
					0,
					7500
				);
			}


			if (campaignText.length > 400) {
				// Send them a copy before deleting.
				msg.direct(`${msg.author.username} rewrite campaign message, too long.\n\n` + msg.content);

				return MessagesHelper.selfDestruct(
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
				return MessagesHelper.selfDestruct(msg, noElecText, 0, 7500);
			}
	
			
			if (isElec) {
				// Check if user is not already a candidate.
				const prevCandidate = await ElectionHelper.getCandidate(msg.author.id);
				if (!prevCandidate) {
					MessagesHelper.selfDestruct(msg, `${msg.author.username}, you wanna stand for <#${CHANNELS.ELECTION.id}>, eyyy?`);

					const emojiText = MessagesHelper.emojiText(EMOJIS.ELECTION_CROWN);
					const electionEmbed = MessagesHelper.embed({ 
						title: `Election Event: ${msg.author.username} stands for election!`,
						description: `${msg.content}\n\n` +
							`To vote for <@${msg.author.id}> press (react) the crown emoji ${emojiText}.`,
						thumbnail: UsersHelper.avatar(msg.author)
					});

					const electionMsg = await ChannelsHelper._postToChannelCode('ELECTION', electionEmbed);

					const msgLink = MessagesHelper.link(electionMsg);
	
					// Add candidate to election
					await ElectionHelper.addCandidate(msg.author.id, msgLink);
	
					// Post to feed
					const successfulCandidateText = `${msg.author.username} was put forward for <#${CHANNELS.ELECTION.id}>`;
					MessagesHelper.selfDestruct(msg, successfulCandidateText);
					ChannelsHelper._postToFeed(successfulCandidateText);
					
					// Add coop emoji to campaign message and crown
					MessagesHelper.delayReact(electionMsg, '👑', 666);
				} 
				// else {
					// // If is already, ask them if they want to replace their campaign text if current message.
					// const wannaEditMsg = await msg.say(`${msg.author.username}, react to change your campaign message?`);
					// // create awaitReaction
					// MessagesHelper.delayReact(wannaEditMsg, '👑', 666);
					// MessagesHelper.delayDelete(wannaEditMsg, 30000);
				// }
			}

		} catch(e) {
			console.error(e);
			console.log('!stand failed.');
		}
    }
    
};