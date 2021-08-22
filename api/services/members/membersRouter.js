import { Router } from "express";
import ElectionHelper from "../../../operations/members/hierarchy/election/electionHelper";

const MembersRouter = Router();

MembersRouter.get('/hierarchy', async (req, res) => {
    const hierarchy = await ElectionHelper.loadHierarchy();

    // Add the next 10 members who weren't already included.
    hierarchy.other_users = [];

    res.status(200).json(hierarchy);
});

export default MembersRouter;
