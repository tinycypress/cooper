import { Router } from "express";
import AccessDiscord from "./access-discord";
import Auth from "./_auth";

const AuthRouter = Router();

AuthRouter.post('/access-discord', AccessDiscord);

// Add Cooper DM the same way tomorrow!! :D
// AuthRouter.post('/access-discord', AccessDiscord);

AuthRouter.get('/me', Auth.guard(), (req, res) => {
    console.log(req.user);
    res.status(200).json({ 
        id: req.user.discord_id,
        username: 'sadly_unknown'
    });
});

AuthRouter.get('/logout', Auth.guard(), (req, res) => {
    res.status(200).json({ logout: 'success' });
});


export default AuthRouter;
