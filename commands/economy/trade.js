import TradingHelper from '../../operations/minigames/medium/economy/items/tradingHelper';

import CoopCommand from '../../operations/activity/messages/coopCommand';
import COOP, { USABLE } from '../../origin/coop';


// TODO: Move to Reactions/Message helper.
const userDesiredReactsFilter = (emojis = []) =>
	({ emoji }, user) => emojis.includes(emoji.name) && !COOP.USERS.isCooper(user.id)

// TODO: Create delayAppend() method.
// 	COOP.MESSAGES.delayEdit(confirmMsg, confirmMsg.content + `...`);
// TODO: Could potentially allow others to take the same trade with this. GME FTW.
// TODO: Ensure trades expire, may need a new date/time on open_trades table.

export default class TradeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'trade',
			group: 'economy',
			memberName: 'trade',
			aliases: ['tr'],
			description: 'This command lets you trade the items you own',
			details: `Details of the trade command`,
			examples: ['trade', '!trade LAXATIVE AVERAGE_EGG 1 5'],
			args: [
				{
					key: 'offerItemCode',
					prompt: 'Which ITEM_CODE are you offering?',
					type: 'string',
					default: ''
				},
				{
					key: 'receiveItemCode',
					prompt: 'Which ITEM_CODE do you expect in return?',
					type: 'string',
					default: ''
				},
				{
					key: 'offerQty',
					prompt: 'Number quantity you are offering?',
					type: 'float',
					default: 1
				},
				{
					key: 'receiveQty',
					prompt: 'Number quantity you expect in return?',
					type: 'float',
					default: 1
				},
			],
		});
	}

	async run(msg, { offerItemCode, receiveItemCode, offerQty, receiveQty }) {
		super.run(msg);

		try {
			const tradeeID = msg.author.id;
			const tradeeName = msg.author.username;

			// Try to parse item codes.
			offerItemCode = COOP.ITEMS.interpretItemCodeArg(offerItemCode);
			receiveItemCode = COOP.ITEMS.interpretItemCodeArg(receiveItemCode);

			// Check if valid item codes given.
			if (!offerItemCode || !receiveItemCode) return COOP.MESSAGES.selfDestruct(msg, 
				`Invalid item codes for trade, ${offerItemCode} ${receiveItemCode}`, 0, 7500);
			

			// Guard against bad/negative amounts for both qtys
			if (!validItemQtyArgFloatGuard(msg, msg.author, offerQty))
				return null;
			if (!validItemQtyArgFloatGuard(msg, msg.author, receiveQty))
				return null;



			// Check if user can fulfil the trade.
			const canUserFulfil = await COOP.ITEMS.hasQty(tradeeID, offerItemCode, offerQty);
			// TODO: Provide a more useful error message here with qty details.
			if (!canUserFulfil) return COOP.MESSAGES.selfDestruct(msg, `Insufficient item quantity for trade.`, 0, 7500);

			// Generate strings with emojis based on item codes.
			const tradeAwayStr = `${COOP.MESSAGES._displayEmojiCode(offerItemCode)}x${offerQty}`;
			const receiveBackStr = `${COOP.MESSAGES._displayEmojiCode(receiveItemCode)}x${receiveQty}`;
			const exchangeString = `<- ${tradeAwayStr}\n-> ${receiveBackStr}`;

			// Check if there is an existing offer matching this specifically.
			const matchingOffers = await TradingHelper
				.matches(receiveItemCode, offerItemCode, receiveQty, offerQty);

			// Build the confirmation message string.
			let confirmStr = `**<@${tradeeID}>, trade away ` +
				`${tradeAwayStr} in return for ${receiveBackStr}?** \n\n` +
				exchangeString;
			if (matchingOffers.length > 0) confirmStr += `\n\n_Matching offers detected._`;
			

			// TODO: Support moving all personal confirmations to DM.

			// TODO: Refactor confirmation into something more abstracted and reuse it. :D

			// Post the confirmation message and add reactions to assist interaction.
			const confirmMsg = await COOP.MESSAGES.selfDestruct(msg, confirmStr, 0, 30000);
			COOP.MESSAGES.delayReact(confirmMsg, '❎', 666);
			COOP.MESSAGES.delayReact(confirmMsg, '✅', 999);

			// Setup the reaction collector for trade confirmation interaction handling.
			const interactions = await confirmMsg.awaitReactions(
				userDesiredReactsFilter(['❎', '✅']), 
				{ max: 1, time: 30000, errors: ['time'] }
			);

			// Check reaction is from user who asked, if restricting confirmation to original.
			const confirmation = interactions.reduce((acc, { emoji, users }) => {
				// TODO: Refactor this line to Reaction helper
				const userReacted = users.cache.has(tradeeID);
				if (emoji.name === '✅' && userReacted) return acc = true;
				else return acc;
			}, false);
			

			if (confirmation) {

				// Accept cheapest matching offer.
				if (matchingOffers.length > 0) {
					// Sort offers by most offer (highest offer) qty amongst matches.
					matchingOffers.sort((a, b) => a.offer_qty > b.offer_qty);

					// Select highest offer.
					const cheapest = matchingOffers[0];

					// Let helper handle accepting of the trade, with a msgRef.
					const tradeAccepted = await TradingHelper.accept(cheapest.id, tradeeID, tradeeName);
					if (tradeAccepted) {
						const exchangeString = `-> ${tradeAwayStr}\n<- ${receiveBackStr}`;
						const tradeConfirmStr = `**${tradeeName} accepted trade #${cheapest.id} from ${cheapest.trader_username}**\n\n` +
							exchangeString;
						
						// If passed a message reference, handle interaction feedback.
							// Refactor this hash string into channelsHelper?
							const actionsLinkStr = `\n\n_View in <#${COOP.CHANNELS.config().TRADE.id}>_`;
		
							// Post accepted trade to channel and record channel.
							COOP.MESSAGES.delayEdit(confirmMsg, tradeConfirmStr + actionsLinkStr, 333);
					} else {
						// Edit failure onto message.
						COOP.MESSAGES.selfDestruct(confirmMsg, 'Failure confirming instant trade.', 666, 5000);
					}


				} else {
					// Use the items to create a trade, so we can assume its always fulfillable,
					//  the item becomes a trade credit note, can be converted back.
					const didUse = await USABLE.use(tradeeID, offerItemCode, offerQty);
					if (didUse) {
						const createdOfferID = await TradingHelper.create(
							tradeeID, tradeeName,
							offerItemCode, receiveItemCode,
							offerQty, receiveQty
						);

						// Remove the original message now to simplify the UI.
						COOP.MESSAGES.delayDelete(confirmMsg, 999);

						// Offer feedback for trade creation. :)
						COOP.CHANNELS.propagate(msg, 
							`**${tradeeName} created trade #${createdOfferID}**\n\n` +
							exchangeString + `\n\n` +
							`_Send message "!tradeaccept ${createdOfferID}" to accept this trade._`,
							'TRADE');

						// TODO: add a reaction to accept the trade, using trade logic.

						// TODO: Add to trade stats
					} else {
						COOP.MESSAGES.selfDestruct(confirmMsg, 'Error creating trade.', 666, 5000);
					}
				}

			} else {
				// Log cancelled trades
				// console.log('Trade cancelled');

				// Trade cancelled, remove message.
				COOP.MESSAGES.delayDelete(confirmMsg);
			}
			
		} catch(e) {
			console.log('Failed to trade item.');
			console.error(e);
		}
    }
    
}
