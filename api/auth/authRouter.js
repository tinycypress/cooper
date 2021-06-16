import { Router } from "express";
import AccessDiscord from "./access-discord";
import AuthoriseDiscord from "./authorise-discord";

const AuthRouter = Router();

AuthRouter.get('/access-discord', AccessDiscord);
AuthRouter.get('/authorise-discord', AuthoriseDiscord);

export default AuthRouter;
