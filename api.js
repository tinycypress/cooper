import cors from 'cors';
import express from 'express';

import Database from './origin/setup/database';

import DiscordChallenge from './api/auth/challenge-discord';
import getBases from './api/services/bases/getBases';




// Run the web api.
bootstrap();

// Define the web api.
export default async function bootstrap() {
  // Connect to PostGres Database and attach event/error handlers.
  await Database.connect();

  // Instantiate the app.
  const app = express();

  // Disable security, tighten "later".
  app.use(cors({ origin: '*' }));

  // Refactor all this into routes.
  app.get('/', (req, res) => res.send('Hello World!'));

  app.get('/request-token', DiscordChallenge);

  app.get('/bases', getBases);

  
  // Start listening on the app.
  app.listen(process.env.PORT);
}

