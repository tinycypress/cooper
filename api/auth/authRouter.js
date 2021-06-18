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
        id: req.user.id,
        username: req.user.username
    })
});

// AuthRouter.get('/authedonly', Auth.guard(), (req, res) => 
//     res.status(200).json({
//         girrafe: true,
//         member_only: true,
//         testing: 'absolutely'
//     })
// );


export default AuthRouter;
