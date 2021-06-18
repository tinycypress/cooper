import cors from 'cors';
import express from 'express';
import passport from 'passport';

import APIRouter from './api/apiRouter';
import Auth from './api/auth/_auth';

import Database from './origin/setup/database';

// Run the web api.
bootstrap();

// Define the web api.
export default async function bootstrap() {
  // Connect to PostGres Database and attach event/error handlers.
  await Database.connect();

  // Instantiate the app.
  const app = express();

  // Enable JSON data reception.
  app.use(express.json);

  // Disable security, tighten "later".
  app.use(cors({ origin: '*' }));

  // Add authentication strategy for protected routes/data.
  passport.use(Auth.strategy());

  // Attach all the routes to the API.
  app.use('/', APIRouter);
  
  // Start listening on the app.
  app.listen(process.env.PORT);
  console.log('API listening');
}

