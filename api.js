import express from 'express';
import Database from './origin/setup/database';

// Run the web api.
bootstrap();

var API_BASE_URL = 'https://cooperchickenbot.herokuapp.com/';

// Define the web api.
export default async function bootstrap() {
  // Connect to PostGres Database and attach event/error handlers.
  await Database.connect();

  const app = express();

  app.get('/', (req, res) => res.send('Hello World!'));
  
  app.listen(process.env.PORT);
}

