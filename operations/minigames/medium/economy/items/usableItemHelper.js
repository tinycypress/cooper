import AverageEggHandler from "./handlers/averageEggHandler";
import RareEggHandler from "./handlers/rareEggHandler";
import LegendaryEggHandler from "./handlers/legendaryEggHandler";
import DiamondHandler from "./handlers/diamondHandler";
import ShieldHandler from "./handlers/shieldHandler";
import RPGHandler from "./handlers/rpgHandler";
import BombHandler from './handlers/bombHandler';
import ToxicEggHandler from './handlers/toxicEggHandler';

import EggHuntMinigame from '../../../small/egghunt';
import ReactionHelper from '../../../../activity/messages/reactionHelper';

import { EMOJIS, RAW_EMOJIS } from "../../../../../origin/config";
import COOP, { STATE, CHICKEN as Chicken, ROLES } from "../../../../../origin/coop";
import ElectionHelper from "../../../../members/hierarchy/election/electionHelper";
import GoldCoinHandler from "./handlers/goldCoinHandler";
import MineHandler from "./handlers/mineHandler";
import DefuseKitHandler from "./handlers/defuseKitHandler";


export default class UsableItemHelper {

    static async onReaction(reaction, user) {
        // Prevent Cooper from interacting with items.
        if (!COOP.USERS.isCooper(user.id)) {
            
            // Player usable items reaction detectors/handlers.
            BombHandler.onReaction(reaction, user);
            DiamondHandler.onReaction(reaction, user);
            ShieldHandler.onReaction(reaction, user);
            RPGHandler.onReaction(reaction, user);
            GoldCoinHandler.onReaction(reaction, user);
            MineHandler.onReaction(reaction, user);
            DefuseKitHandler.onReaction(reaction, user);

            // TODO: CHECK THAT NOBODY ELSE REACTED.

            // Check if message is dropped item message being picked up.
            if (this.isPickupable(reaction, user)) {
                this.pickup(reaction, user);
            }
        }

        // Allow Cooper to add average/rare/legendary eggs when prompted.
        // SPAMREFORM: Should not remove reaction if insufficient qty (cooper only)
        // SPAMREFORM: Should fail silently.
        ToxicEggHandler.onReaction(reaction, user);
        LegendaryEggHandler.onReaction(reaction, user);
        AverageEggHandler.onReaction(reaction, user);
        RareEggHandler.onReaction(reaction, user);
    }

    static async use(userID, itemCode, useQty, note = 'Used item') {
        // Attempt to load item ownership.
        const ownedQty = await COOP.ITEMS.getUserItemQty(userID, itemCode);

        // Check if enough qty of item is owned.
        if (ownedQty - useQty >= 0) {
            // TODO: Just ensure that subtract does this itself...? Get rid of use?
            await COOP.ITEMS.subtract(userID, itemCode, useQty, note);
            return true;
        } else return false;
    }

    static getUsableItems() {
        const unusable = this.NON_USABLE_EMOJIS;
        const codeFilter = itemCode => !unusable.includes(itemCode);
        return Object.keys(EMOJIS).filter(codeFilter);
    }

    static isDroppedItemMsg(msg) {
        return ReactionHelper.didUserReactWith(
            msg, Chicken.getDiscordID(), RAW_EMOJIS.DROPPED
        );
    }

    static isUsable(itemCode) {
		return this.getUsableItems().includes(itemCode);
    }

    static NON_USABLE_EMOJIS = [
        "COOP",
        "VOTE_FOR",
        "VOTE_AGAINST",

        "LEGENDARY_CRATE",
        "LEGENDARY_CRATE_OPEN",
        "RARE_CRATE",
        "RARE_CRATE_OPEN",
        "AVERAGE_CRATE",
        "AVERAGE_CRATE_OPEN",

        "POLL_FOR",
        "POLL_AGAINST",
        "ROADMAP",
        "SACRIFICE_SHIELD",
        "ROCK",

        "DROPPED",
        "BASKET",

        // Maybe usable.
        "DAGGER",
    ];

    // Check if a message has an emoji and is pickupable.
    static isPickupable(reaction) {
        // Check if message has dropped emoji and by Cooper (official/valid drop).
        if (!this.isDroppedItemMsg(reaction.message)) return false;

        // Check if they are trying to collect via basket
        if (reaction.emoji.name !== EMOJIS.BASKET) return false;

        // Don't allow more pickups after 1 count.
        if (reaction.count > 2) return false;
    
        // Appears to be safe to pickup.
        return true;
    }

    // The event handler for when someone wants to pickup a dropped item message.
    static async pickup(reaction, user) {
        try {
            // Find item code via emoji/emoji ID (trimmed) string in comparison to emojis.json.
            const emojiID = COOP.MESSAGES.getEmojiIdentifier(reaction.message);
            const itemCode = COOP.ITEMS.emojiToItemCode(emojiID);

            // Prevent non-members from picking things up.
            if (!ROLES._idHasCode(user.id, 'MEMBER'))
                return COOP.MESSAGES.selfDestruct(reaction.message,
                    `${user.username} you can't pick that up, only members (role) can pick up items.`
                );

            // If invalid item code or not usable, don't allow pick up event.
            if (!itemCode || !this.isUsable(itemCode))
                // TODO: Maybe use reply functionality to point to message they tried to pick up?
                return COOP.MESSAGES.selfDestruct(reaction.message,
                    `${user.username} you can't pick that up.`
                );

            // If collecting a dropped egg, high chance (40%) of breaking due to having been dropped.
            if (EggHuntMinigame.reactValid(reaction) && STATE.CHANCE.bool({ likelihood: 40 })) {
                // Clear after a while of showing the edited state.
                COOP.MESSAGES.delayDelete(reaction.message, 10000);
                return COOP.MESSAGES.delayEdit(reaction.message,
                    `${user.username} broke ${reaction.message.content}...`, 0
                );
            }
            
            // Clear the message to prevent abuse.
            COOP.MESSAGES.delayDelete(reaction.message, 0);

            // Add recalculated item ownership to user.
            // TODO: Add channel name in pick up.
            const addEvent = await COOP.ITEMS.add(user.id, itemCode, 1, 'Picked up');

			// Intercept the giving of election items.
			if (itemCode === 'LEADERS_SWORD' || itemCode === 'ELECTION_CROWN')
				ElectionHelper.ensureItemSeriousness();

            // TODO: ADD TO STATISTICS!

            // Format and display success message temporarily to channel and as a record in actions channel.
            const emojiText = COOP.MESSAGES.emojiText(emojiID);
            const displayItemCode = COOP.ITEMS.escCode(itemCode);

            COOP.CHANNELS.propagate(
                reaction.message,
                `${user.username} picked up ${displayItemCode} ${emojiText} and now has x${addEvent}.`,
                'ACTIONS'
            );
        } catch(e) {
			console.log('Error with pickup handler.');
			console.error(e);
        }
    }



}
