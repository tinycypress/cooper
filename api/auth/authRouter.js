import { Router } from "express";
import AccessDiscord from "./access-discord";

const AuthRouter = Router();

AuthRouter.get('/access-discord', AccessDiscord);

export default AuthRouter;
