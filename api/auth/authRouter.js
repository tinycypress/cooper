import { Router } from "express";
import DiscordChallenge from "./challenge-discord";

const AuthRouter = Router();

AuthRouter.get('/request-token', DiscordChallenge);

export default AuthRouter;

