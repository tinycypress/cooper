import express from 'express';
import Database from './origin/setup/database';


// Dev quick copy and paste oauth url:
// https://discord.com/api/oauth2/authorize?client_id=799695179623432222&redirect_uri=https%3A%2F%2Fapi.thecoop.group%2Fchallenge-discord-identity&response_type=code&scope=identify

// Run the web api.
bootstrap();

// Try to find the most direct way to make global (hence var here).
var API_BASE_URL = 'https://cooperchickenbot.herokuapp.com/';

// Define the web api.
export default async function bootstrap() {
  // Connect to PostGres Database and attach event/error handlers.
  await Database.connect();

  const app = express();

  app.get('/', (req, res) => res.send('Hello World!'));

  app.get('/challenge-discord-identity', (req, res) => {
    console.log(req);

    res.send('Hello Discord!')
  });

  
  app.listen(process.env.PORT);
}

