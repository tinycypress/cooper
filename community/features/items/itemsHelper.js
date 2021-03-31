import MessagesHelper from "../../../core/entities/messages/messagesHelper";
import Database from "../../../core/setup/database";

import EMOJIS from '../../../core/config/emojis.json';
import RAW_EMOJIS from '../../../core/config/rawemojis.json';

import DatabaseHelper from "../../../core/entities/databaseHelper";

// Items with reaction usages.
import BombHandler from "./handlers/bombHandler";
import ToxicEggHandler from "./handlers/toxicEggHandler";
import AverageEggHandler from "./handlers/averageEggHandler";
import RareEggHandler from "./handlers/rareEggHandler";
import LegendaryEggHandler from "./handlers/legendaryEggHandler";
import DiamondHandler from "./handlers/diamondHandler";
import UsersHelper from "../../../core/entities/users/usersHelper";
import EggHuntMinigame from "../minigame/small/egghunt";
import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import ReactionHelper from "../../../core/entities/messages/reactionHelper";
import Chicken from "../../chicken";
import EmojiHelper from "./emojiHelper";
import RolesHelper from "../../../core/entities/roles/rolesHelper";
import PointsHelper from "../points/pointsHelper";
import STATE from "../../../core/state";
import ShieldHandler from "./handlers/shieldHandler";


export default class ItemsHelper {

    static async onReaction(reaction, user) {

        // Prevent Cooper from interacting with items.
        if (!UsersHelper.isCooper(user.id)) {
            
            // Player usable items reaction detectors/handlers.
            BombHandler.onReaction(reaction, user);
            DiamondHandler.onReaction(reaction, user);
            ShieldHandler.onReaction(reaction, user);
            				
            // Check if message is dropped item message being picked up.
            if (this.isPickupable(reaction, user)) {
                this.pickup(reaction, user);
            }
        }

        // Allow Cooper to add average/rare eggs when prompted.
        // SPAMREFORM: Should fail silently.
        ToxicEggHandler.onReaction(reaction, user);
        LegendaryEggHandler.onReaction(reaction, user);
        AverageEggHandler.onReaction(reaction, user);
        RareEggHandler.onReaction(reaction, user);
    }


    // Input Takes a string and extracts the items mentioned in it. Returns an array containing the item codes. The search is greedy so will extrct the longest possible name
    static parseItemCodes(inputString) {
        // Remove multiple spaces and make uppercase
        const str = inputString.replace(/\s\s+/g, ' ').toUpperCase();

        const usableItemsStr = ItemsHelper.getUsableItems();

        // Generate The regex to match the items. This is only done once to save server time
        const matchRegex = new RegExp("(" + usableItemsStr.join("|").replace("_", "[_\\s]") + ")", 'g');

        // Match with the regex. This returns an array of the found matches
        const matches = str.match(matchRegex);

        // Return matches as canonical item codes
        return matches.map(x => x.replace(/\s/g, '_'));
    }

    static beautifyItemCode(itemCode) {
        const lowerName = itemCode.replace("_", " ").toLowerCase();
        const nameCapitalized = lowerName.charAt(0).toUpperCase() + lowerName.slice(1);
        const emoji = MessagesHelper.emojifyID(EMOJIS[itemCode]);
        return emoji + " " + nameCapitalized + " ";
    }


    static async add(userID, item_code, quantity) {
        const query = {
            name: "add-item",
            text: `INSERT INTO items(owner_id, item_code, quantity)
                VALUES($1, $2, $3) 
                ON CONFLICT (owner_id, item_code)
                DO 
                UPDATE SET quantity = items.quantity + EXCLUDED.quantity
                RETURNING quantity`,
            values: [userID, item_code, quantity]
        };
        
        const result = await Database.query(query);
        const newQty = (result.rows[0] || { quantity: 0 }).quantity;
        return newQty;
    }

    static async subtract(userID, itemCode, subQuantity) {
        // If item count goes to zero, remove it
        const query = {
            name: "subtract-item",
            text: `UPDATE items 
                SET quantity = quantity - $3 WHERE owner_id = $1 AND item_code = $2
                RETURNING quantity`,
            values: [userID, itemCode, subQuantity]
        };
        const updateResult = await Database.query(query);

        // Remove if zero
        if (updateResult.rowCount > 0) {
            const updatedQty = updateResult.rows[0].quantity || 0;
            if (updatedQty <= 0) await this.delete(userID, itemCode);
        }

        return updateResult;
    }

    static async getUserItem(userID, itemCode) {
        const query = {
            name: "get-user-item",
            text: `SELECT * FROM "items" WHERE owner_id = $1 AND item_code = $2`,
            values: [userID, itemCode]
        };
        return DatabaseHelper.single(await Database.query(query));
    }

    static async getUserItemQty(userID, itemCode) {
        let qty = 0;
        const userItem = await this.getUserItem(userID, itemCode);
        if (userItem) qty = userItem.quantity || 0;
        return qty;
    }

    static async hasQty(userID, itemCode, qty) {
        const hasQty = await this.getUserItemQty(userID, itemCode);
        return hasQty >= qty;
    }
    
    static async getUserItems(userID) {
        const query = {
            name: "get-all-user-items",
            text: `SELECT * FROM "items" WHERE owner_id = $1`,
            values: [userID]
        };

        return DatabaseHelper.many(await Database.query(query));
    }

    static async count(itemCode) {
        const query = {
            name: "count-item",
            text: "SELECT SUM(quantity) FROM items WHERE item_code = $1",
            values: [itemCode]
        };

        const result = DatabaseHelper.single(await Database.query(query));
        const count = result.sum || 0;

        return count;
    }

    static async read(userID, itemCode) {
        const query = {
            name: "read-item",
            text: "SELECT * FROM items WHERE owner_id = $1 AND item_code = $2",
            values: [userID, itemCode]
        };
        return await Database.query(query);
    }

    static async update(userID, itemCode, quantity) {
        const query = {
            name: "update-item",
            text: `UPDATE items SET quantity = $3 
                WHERE owner_id = $1 AND item_code = $2`,
            values: [userID, itemCode, quantity]
        };
        return await Database.query(query);
    }

    static async delete(userID, itemCode) {
        const query = {
            name: "delete-item",
            text: "DELETE FROM items WHERE owner_id = $1 AND item_code = $2",
            values: [userID, itemCode]
        };
        return await Database.query(query);
    }
    
    static formItemDropText(user, items) {
        let itemDisplayMsg = `${user.username}'s items:`;
        items.forEach(item => {
            const emojiIcon = MessagesHelper.emojifyID(EMOJIS[item.item_code]);
            const itemText = `\nx${item.quantity} ${this.escCode(item.item_code)} ${emojiIcon}`;
            itemDisplayMsg += itemText;
        })
        return itemDisplayMsg
    }

    static async use(userID, itemCode, useQty) {
        // Attempt to load item ownership.
        const ownedQty = await this.getUserItemQty(userID, itemCode);

        // Check if enough qty of item is owned.
        if (ownedQty - useQty >= 0) {
            await this.subtract(userID, itemCode, useQty);
            return true;
        } else return false;
    }
 
    static isUsable(itemCode) {
		return this.getUsableItems().includes(itemCode);
    }

    static escCode(itemCode) {
        return `**${itemCode.replace('_', '\\_')}**`;
    }

    static parseFromStr(str) {
        let match = null;
        const usables = this.getUsableItems();
        const key = str.trim().replace(' ', '_').toUpperCase();
        usables.map(usable => {
            if (usable === key) match = usable;
        });
        return match;
    }

    static getUsableItems() {
        const unusable = this.NON_USABLE_EMOJIS;
        const codeFilter = itemCode => !unusable.includes(itemCode);
        return Object.keys(EMOJIS).filter(codeFilter);
    }

  

    static async getUserWithItem(itemCode) {
        const query = {
            name: "get-user-with-item",
            text: `SELECT * FROM "items" WHERE quantity > 0 AND item_code = $1`,
            values: [itemCode]
        };
        const result = await Database.query(query);
        return DatabaseHelper.single(result);
    }

    static async getUsersWithItem(itemCode) {
        const query = {
            name: "get-users-with-item",
            text: `SELECT * FROM "items" WHERE quantity > 0 AND item_code = $1`,
            values: [itemCode]
        };
        const result = await Database.query(query);
        return DatabaseHelper.many(result);
    }
    
    static itemEmojiQtyStr(itemCode, itemQty = 1) {
        return `${MessagesHelper._displayEmojiCode(itemCode)}x${itemQty}`;
    }

    static gainItemQtyStr(itemCode, itemQty = 1) {
        return `-> ${this.itemEmojiQtyStr(itemCode, itemQty)}`;
    }

    static lossItemQtyStr(itemCode, itemQty = 1) {
        return `<- ${this.itemEmojiQtyStr(itemCode, itemQty)}`;
    }

    static exchangeItemsQtysStr(lossItem, lossQty, gainItem, gainQty) {
        return `${this.lossItemQtyStr(lossItem, lossQty)}\n${this.gainItemQtyStr(gainItem, gainQty)}`;
    }

    static isDroppedItemMsg(msg) {
        return ReactionHelper.didUserReactWith(
            msg, Chicken.getDiscordID(), RAW_EMOJIS.DROPPED
        );
    }

    // Check if a message has an emoji and is pickupable.
    static isPickupable(reaction, user) {
        // Check if message has dropped emoji and by Cooper (official/valid drop).
        if (!this.isDroppedItemMsg(reaction.message)) return false;

        // Check if they are trying to collect via basket
        if (reaction.emoji.name !== EMOJIS.BASKET) return false;

        // Appears to be safe to pickup.
        return true;
    }

    static emojiToItemCode(emoji) {
        let itemCode = null;
        Object.keys(EMOJIS).map(emojiName => {
            if (EMOJIS[emojiName] === emoji) itemCode = emojiName;
        });
        return itemCode;
    }

    // Try to parse item codes.
    static interpretItemCodeArg(text) {
		let itemCode = null;
        
        // Interpret item code from the assumed item name not emoji.
        itemCode = this.parseFromStr(text);

        // Prioritse emoji overwriting/preference over text (if supplied).
        const emojiID = MessagesHelper.strToEmojiID(text);
        const emojiSupportedCode = this.emojiToItemCode(emojiID);
        if (emojiSupportedCode) itemCode = emojiSupportedCode;

        // Prioritise direct emoji overwriting if given as plain/raw/direct emoji encoded string.
        const rawToItem = EmojiHelper.rawEmojiToCode(text);
        if (rawToItem) itemCode = rawToItem;

        return itemCode;
    }

    // The event handler for when someone wants to pickup a dropped item message.
    static async pickup(reaction, user) {
        try {
            // Find item code via emoji/emoji ID (trimmed) string in comparison to emojis.json.
            const emojiID = MessagesHelper.getEmojiIdentifier(reaction.message);
            const itemCode = this.emojiToItemCode(emojiID);
                
            // If invalid item code or not usable, don't allow pick up event.
            if (!itemCode || !ItemsHelper.isUsable(itemCode))
                return MessagesHelper.selfDestruct(reaction.message,
                    `${user.username} you can't pick that up. (${itemCode})`
                );

            // If collecting a dropped egg, high chance (40%) of breaking due to having been dropped.
            if (EggHuntMinigame.reactValid(reaction) && STATE.CHANCE.bool({ likelihood: 40 })) {
                // Clear after a while of showing the edited state.
                MessagesHelper.delayDelete(reaction.message, 10000);
                return MessagesHelper.delayEdit(reaction.message,
                    `${user.username} broke ${reaction.message.content}...`
                );
            }
            
            // Clear the message to prevent abuse.
            MessagesHelper.delayDelete(reaction.message, 333);

            // Add recalculated item ownership to user.
            const addEvent = await ItemsHelper.add(user.id, itemCode, 1);

            // TODO: ADD TO STATISTICS!

            // Format and display success message temporarily to channel and as a record in actions channel.
            const emojiText = MessagesHelper.emojiText(emojiID);
            const displayItemCode = this.escCode(itemCode);

            ChannelsHelper.propagate(
                reaction.message,
                `${user.username} picked up ${displayItemCode} ${emojiText} and now has x${addEvent}.`,
                'ACTIONS'
            );
        } catch(e) {
			console.log('Error with pickup handler.');
			console.error(e);
        }
    }

    // Get the total count of user's items.
    static async getUserTotal(id) {
        let total = 0;

        const query = {
            name: "get-user-owned-total",
            text: `SELECT owner_id, SUM(quantity) as total FROM items
                WHERE owner_id = $1
                GROUP BY owner_id ORDER BY total DESC LIMIT 1`,
            values: [id]
        };

        const result = await Database.query(query);
        const userItemsSum = DatabaseHelper.single(result);
        if (userItemsSum) total = userItemsSum.total;

        return total;
    }



    static async getRichest() {
        const query = {
            name: "get-richest",
            text: `SELECT owner_id, SUM(quantity) as total FROM items 
                WHERE item_code = 'GOLD_COIN'
                GROUP BY owner_id ORDER BY total DESC LIMIT 1`
        };
        const result = await Database.query(query);
        const richest = DatabaseHelper.single(result);

        return richest;
    }


    // Calculating person with most items and rewarding them.
    static async updateRichest() {
        // Calculate the community user with most items.
        const richestDb = await this.getRichest();

        // Access the member with the most items.
        const richestMember = UsersHelper._get(richestDb.owner_id);
        const username = richestMember.user.username;

        // Load the most items role, cache is probably fine.
        const richestRole = RolesHelper._getByCode('RICHEST');

        // Calculate if they already had this reward role on last check.
        let alreadyHadRole = false;

        // Remove the role from previous winner and commiserate.
        let prevWinner = null;
        richestRole.members.map(prevMostMember => {
            if (prevMostMember.user.id === richestMember.user.id) alreadyHadRole = true;
            else {
                prevWinner = prevMostMember.user;
                prevMostMember.roles.remove(richestRole);
            }
        });

        // If the new winner didn't already have the role, award it and notify server.
        if (!alreadyHadRole) {
            // Add point reward to item leader.
            const pointsAfter = await PointsHelper.addPointsByID(richestMember.user.id, 100);
            
            // Add the role to new item leader.
            richestMember.roles.add(richestRole);
            
            // Post Feedback.            
            let successText = `${username} is now the **richest**!`;
            if (prevWinner) successText = ` ${username} overtakes ${prevWinner.username} as richest member!`;
            successText += ` Given RICHEST reward role and 100 points (${pointsAfter})!`;
            ChannelsHelper._postToFeed(successText);
        }
    }




    // Calculating person with most items and rewarding them.
    static async getBiggestWhale() {
        // Calculate the community user with most items.
        const query = {
            name: "get-all-owned-sums",
            text: `SELECT owner_id, SUM(quantity) as total FROM items GROUP BY owner_id ORDER BY total DESC LIMIT 1`
        };
        
        const result = await Database.query(query);
        const mostItems = DatabaseHelper.single(result);

        return mostItems;
    }


    // Calculating person with most items and rewarding them.
    static async updateMostItems() {
        const mostItems = await this.getBiggestWhale();

        // Access the member with the most items.
        const mostItemsMember = UsersHelper._get(mostItems.owner_id);
        const username = mostItemsMember.user.username;

        // Load the most items role, cache is probably fine.
        const mostItemsRole = RolesHelper._getByCode('MOST_ITEMS');

        // Calculate if they already had this reward role on last check.
        let alreadyHadRole = false;

        // Remove the role from previous winner and commiserate.
        let prevWinner = null;
        mostItemsRole.members.map(prevMostMember => {
            if (prevMostMember.user.id === mostItems.owner_id) alreadyHadRole = true;
            else {
                prevWinner = prevMostMember.user;
                prevMostMember.roles.remove(mostItemsRole);
            }
        });

        // If the new winner didn't already have the role, award it and notify server.
        if (!alreadyHadRole) {
            // Add point reward to item leader.
            const pointsAfter = await PointsHelper.addPointsByID(mostItems.owner_id, 50);
            
            // Add the role to new item leader.
            mostItemsMember.roles.add(mostItemsRole);
            
            // Post Feedback.            
            let successText = `${username} is now the biggest hoarder.`;
            if (prevWinner) successText = ` ${username} overtakes ${prevWinner.username} for most items!`;
            successText += ` Given MOST ITEMS reward role and 50 points (${pointsAfter})!`;
            ChannelsHelper._postToFeed(successText);
        }
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

}
