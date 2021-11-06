import _ from 'lodash';
import { Router } from "express";
import Database from '../../../origin/setup/database.mjs';

const DonationRouter = Router();

DonationRouter.post('/', async (req, res) => {

    try {
        // Guard against false claims.
        const secret = _.get(req.body, 'secret');
        if (process.env.RAISELY_ENCRYPTION_KEY !== secret)
            return console.log('Did not process donation without shared secret.', req.body);

        // Access the webhook body data.
        const data = _.get(req.body, 'data.data');

        console.log(data);

        const donation = {
            discord_full_username: null,
            acknowledged: false,
            amount: 0,
            created_on: new Date
        }

        // Access the potential discord ID from webhook payload.
        const discordID = _.get(req.body, 'data.data.public.discordID');
        if (discordID)
            donation.discord_full_username = discordID;
        else
            donation.acknowledged = true;

        // Insert the donation into the database.
        Database.query({
            name: 'insert-donation',
            text: `INSERT INTO donations (
                    discord_full_username, acknowledged, amount, created_on
                ) VALUES ($1, $2, $3, $4)`,
            values: [
                donation.discord_full_username, 
                donation.acknowledged, 
                donation.amount, 
                donation.created_on
            ]
        });

        res.sendStatus(200);
        
    } catch(e) {
        console.log('Donation failed.');
        console.error(e);

        res.sendStatus(500);
    }
});

export default DonationRouter;