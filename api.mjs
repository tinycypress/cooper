import http from 'http';
import cors from 'cors';
import express from 'express';
import passport from 'passport';

import configureWS from './api/services/socket/configure.mjs';
import Database from './origin/setup/database.mjs';

import APIRouter from './api/apiRouter.mjs';
import Auth from './api/auth/_auth.mjs';

import bodyParser from 'body-parser';
const { urlencoded, json } = bodyParser;

// Run the web api.
bootstrap();

// Define the web api.
export default async function bootstrap() {
  // Connect to PostGres Database and attach event/error handlers.
  await Database.connect();

  // Instantiate the app.
  const app = express();

  // Enable incoming data parsing.
  app.use(urlencoded({ extended: false }));
  app.use(json());

  // Disable security, tighten "later".
  app.use(cors({ origin: '*' }));

  // Add authentication strategy for protected routes/data.
  passport.use(Auth.strategy());

  // Ensure passport is initialised on app.
  app.use(passport.initialize());

  // Create a separate http server for socket-io attach and regular services.
  const server = http.createServer(app);

  // Attach all the routes to the API.
  app.use('/', APIRouter);

  // Start listening with the websocket handler.
  configureWS(server);
  
  // Start listening on the app.
  server.listen(process.env.PORT);
  console.log('API listening, port: ' + process.env.PORT);
}

