import { Router } from "express";

const DonationRouter = Router();

DonationRouter.get('/', async (req, res) => {
    console.log('Donation1?!?!');
    console.log(req.body);

    // process.env.RAISELY_ENCRYPTION_KEY

    res.sendStatus(200);
    // .json({
    //     "DONATION": "TESTING"
    // });
});

export default DonationRouter;


// {
//     "secret": "myverysecretsecret",
//     "data": {
//       "uuid": "xxxx-xxxx-xxxx-xxxx", // unique uuid of the event
//       "type": "profile.updated",
//       "createdAt": "2018-02-19T00:00:00Z", // ISO8601 timestamp of when the event was created
//       "source": "campaign:uuid", // where the event originated from in the format of model:uuid
//       "data": {
//         "uuid": "xxxx-xxxx-xxxx-xxxx"
//         // JSON representation of the model
//       },
      
//       "diff": {
//         "new": {
//           "description": "My new description"
//         },
//         "old": {
//           "description": "My old description"
//         }
//       }
//     }
//   }