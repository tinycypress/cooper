import cors from 'cors';
import express from 'express';
import APIRouter from './api/apiRouter';

import Database from './origin/setup/database';

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

  // Attach all the routes to the API.
  app.use('/', APIRouter);
  
  // Start listening on the app.
  app.listen(process.env.PORT);
}

