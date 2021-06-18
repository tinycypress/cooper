import { Router } from "express";
import AccessDiscord from "./access-discord";
import Auth from "./_auth";

const AuthRouter = Router();

AuthRouter.post('/access-discord', AccessDiscord);

// TODO: Test this and remove it, prove the guard is working for protected data.
AuthRouter.get('/authedonly', Auth.guard(), (req, res) => 
    res.status(200).json({
        girrafe: true,
        member_only: true,
        testing: 'absolutely'
    })
);



export default AuthRouter;
