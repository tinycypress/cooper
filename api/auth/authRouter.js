import { Router } from "express";
import AccessDiscord from "./access-discord";
import passport from 'passport';

const AuthRouter = Router();

AuthRouter.post('/access-discord', AccessDiscord);

// TODO: Test this and remove it, prove the guard is working for protected data.
AuthRouter.get('/authedonly', passport.authenticate('jwt', { session: false }, (req, res) => 
    res.status(200).json({
        girrafe: true,
        member_only: true,
        testing: 'absolutely'
    })
);



export default AuthRouter;
