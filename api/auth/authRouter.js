import { Router } from "express";
import Access from "./access";
import AccessDiscord from "./access-discord";
import Auth from "./_auth";

const AuthRouter = Router();


// Route which handles authentication via Discord oAuth but also Cooper DMs.
AuthRouter.post('/access', Access);

// An endpoint mostly related to session/user data during-around authentication.
AuthRouter.get('/me', Auth.guard(), (req, res) => {
    console.log(req.user);
    res.status(200).json({ 
        id: req.user.discord_id,
        username: 'sadly_unknown'
    });
});


// TODO: ...
// Stupid... remove from here and nuxt at next available opportunity!!!!!
AuthRouter.get('/logout', Auth.guard(), (req, res) => {
    res.status(200).json({ logout: 'success' });
});


export default AuthRouter;
