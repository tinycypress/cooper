import { Router } from "express";

const MembersRouter = Router();

MembersRouter.get('/hierarchy', async (req, res) => {
    // const posts = await BlogHelper.loadHeadlines();

    res.status(200).json({
        hierarchy: {
            commander: null,
            leaders: [],
            motw: null,
            other_users: []
        }
    });
});

export default MembersRouter;
