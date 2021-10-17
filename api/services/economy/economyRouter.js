import { Router } from "express";
import TradingHelper from "../../../operations/minigames/medium/economy/items/tradingHelper";
import { POINTS } from "../../../origin/coop";

const EconomyRouter = Router();

EconomyRouter.get('/', async (req, res) => {
    res.status(200).json({
        "ECONOMY": "TESTING"
    });
});

EconomyRouter.get('/leaderboard', async (req, res) => {
    const leaderboardRows = await POINTS.getLeaderboard(0);
    res.status(200).json(leaderboardRows);
});

EconomyRouter.get('/trades', async (req, res) => {
    const trades = await TradingHelper.all(50);
    res.status(200).json(trades);
});

export default EconomyRouter;
