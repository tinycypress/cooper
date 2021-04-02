import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import DatabaseHelper from "../../../core/entities/databaseHelper";
import Database from "../../../core/setup/database";
import ItemsHelper from "../items/itemsHelper";
import UsableItemHelper from "../items/usableItemHelper";

export default class TradeHelper {

    static async remove(tradeID) {
        const query = {
            name: "remove-trade-id",
            text: `DELETE FROM open_trades WHERE id = $1`,
            values: [tradeID]
        };

        const result = await Database.query(query);
        return result;
    }

    // Defaults to returning 15 latest trades.
    static async all(limit = 15) {
        const query = {
            name: "get-all-trades",
            text: `SELECT * FROM open_trades ORDER BY id ASC LIMIT $1;`,
            values: [limit]
        };

        const result = await Database.query(query);
        return DatabaseHelper.many(result);
    }

    static async create(userID, username, offerItem, receiveItem, offerQty, receiveQty) {
        const query = {
            name: "create-trade",
            text: `INSERT INTO open_trades(trader_id, trader_username, offer_item, receive_item, offer_qty, receive_qty) 
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            values: [userID, username, offerItem, receiveItem, offerQty, receiveQty]
        };
        const result = DatabaseHelper.single(await Database.query(query));

        let tradeID = null;
        if (typeof result.id !== 'undefined') tradeID = result.id;

        return tradeID;
    }

    static async findOfferMatches(offerItem) {
        const query = {
            name: "get-trades-by-offer",
            text: `SELECT * FROM open_trades WHERE offer_item = $1`,
            values: [offerItem]
        };

        const result = await Database.query(query);
        return DatabaseHelper.many(result);
    }

    static async findReceiveMatches(receiveItem) {
        const query = {
            name: "get-trades-by-offer",
            text: `SELECT * FROM open_trades WHERE receive_item = $1`,
            values: [receiveItem]
        };

        const result = await Database.query(query);
        return DatabaseHelper.many(result);
    }

    static async findOfferReceiveMatches(offerItem, receiveItem) {
        const query = {
            name: "get-trades-by-offer-receive",
            text: `SELECT * FROM open_trades WHERE offer_item = $1 AND receive_item = $2`,
            values: [offerItem, receiveItem]
        };

        const result = await Database.query(query);
        return DatabaseHelper.many(result);
    }

    static async matches(offerItem, receiveItem, offerQty, receiveQty) {
        const query = {
            name: "get-trades-by-offer-receive-qty",
            text: `SELECT * FROM open_trades 
                WHERE offer_item = $1 AND receive_item = $2 AND offer_qty = $3 AND receive_qty <= $4`,
            values: [offerItem, receiveItem, offerQty, receiveQty]
        };

        const result = await Database.query(query);
        return DatabaseHelper.many(result);
    }

    static async listMatch(offerItem, receiveItem) {
        const query = {
            name: "get-matches-of-type",
            text: `SELECT * FROM open_trades WHERE offer_item = $1 and receive_item = $2`,
            values: [offerItem, receiveItem]
        };
        
        const result = await Database.query(query);
        return DatabaseHelper.many(result);
    }

    static async get(tradeID) {
        const query = {
            name: "get-open-trade-id",
            text: `SELECT * FROM open_trades WHERE id = $1`,
            values: [tradeID]
        };
        
        const result = await Database.query(query);
        return DatabaseHelper.single(result);
    }

    static async getByTrader(traderID) {
        const query = {
            name: "get-open-by-trader-id",
            text: `SELECT * FROM open_trades WHERE trader_id = $1`,
            values: [traderID]
        };
        
        const result = await Database.query(query);
        return DatabaseHelper.many(result);
    }


    // Turn trade into items receive/loss string from searcher perspective 
    // (not trader perspective).
    static tradeItemsStr(trade) {
        return ItemsHelper.exchangeItemsQtysStr(
            trade.receive_item, trade.receive_qty,
            trade.offer_item, trade.offer_qty
        );
    }

    static manyTradeItemsStr(trades) {
        return trades.map(trade => 
            `#${trade.id} by ${trade.trader_username}\n${this.tradeItemsStr(trade)}\n\n`
        ).join('');
    }

    // This method directly takes items from user to close a trade.
    static async accept(openTradeID, accepteeID, accepteeName) {
        try {
            // Get trade by ID
            const trade = await this.get(openTradeID);

            // Trade may have been removed before accept.
            if (trade) {
                // Try to use/fulfil the trade.
                const didUse = await UsableItemHelper.use(accepteeID, trade.receive_item, trade.receive_qty);
                if (didUse) {
                    // Add the offer items to the acceptee.
                    await ItemsHelper.add(accepteeID, trade.offer_item, trade.offer_qty);
    
                    // Add the receive items to the trader.
                    await ItemsHelper.add(trade.trader_id, trade.receive_item, trade.receive_qty);
    
                    // Delete/close the open trade offer.
                    await this.remove(openTradeID);
    
                    // Build string for logging/feedback.
                    const exchangeStr = this.tradeItemsStr(trade);
                    const actionStr = `**${accepteeName} accepted trade #${trade.id} from ${trade.trader_username}`;
                    const tradeConfirmStr = `${actionStr}**\n\n${exchangeStr}`;
                                        
                    // Log confirmed trades
                    ChannelsHelper._postToChannelCode('TRADE', tradeConfirmStr, 999);

                    // Return successful result.
                    return true;
                }
            }
        } catch(e) {
            console.log('Error accepting trade offer.');
            console.error(e);
        }        
        return false;
    }

    static async cancel(cancelTradeID, canceleeID, canceleeName) {
        try {
            // Get trade by ID
            const trade = await this.get(cancelTradeID);

            // Add the offer items to the cancelee.
            await ItemsHelper.add(canceleeID, trade.offer_item, trade.offer_qty);

            // Delete/close the open trade offer.
            await this.remove(cancelTradeID);

            // Build string for logging/feedback.
            const lossItemQtyStr = ItemsHelper.lossItemQtyStr(trade.offer_item, trade.offer_qty);
            const tradeCancelStr = `**${canceleeName} cancelled trade #${trade.id}**\n\n${lossItemQtyStr}`;

            // Log confirmed trades
            ChannelsHelper._postToChannelCode('TRADE', tradeCancelStr, 999);

            // Return successful result.
            return true;

        } catch(e) {
            console.log('Error accepting trade offer.');
            console.error(e);
            return false;
        }        
    }

    // Calculate conversion rate between items based on current open trade rates.
    static async conversionRate(offerItem, receiveItem) {
        const matches = await TradeHelper.findOfferReceiveMatches(offerItem, receiveItem);
        const ratios = matches.map(match => match.receive_qty / match.offer_qty);
        const sumAverage = ratios.reduce((acc, val) => {
          acc += val;
          return acc;
        }, 0);
        const average = sumAverage / ratios.length;

        return average;
    }

}