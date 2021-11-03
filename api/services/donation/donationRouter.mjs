import _ from 'lodash';
import { Router } from "express";

const DonationRouter = Router();

DonationRouter.post('/', async (req, res) => {
    // process.env.RAISELY_ENCRYPTION_KEY

    // Access the potential discord ID from webhook payload.
    const discordID = _.get(req.body, 'data.data.public.discordID');
    if (discordID) {
        console.log('Donation with Discord ID', discordID);
    } else {
        console.log('Donation without Discord ID');
    }
    
    const data = _.get(req.body, 'data.data');
    console.log(data);

    res.sendStatus(200);
});

export default DonationRouter;