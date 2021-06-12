import express from 'express';
import Database from './origin/setup/database';

// Run the web api.
bootstrap();

// Define the web api.
export default async function bootstrap() {
  // Connect to PostGres Database and attach event/error handlers.
  await Database.connect();

  const app = express();
  const port = process.env.PORT;
  
  app.get('/', (req, res) => {
    res.send('Hello World!')
  });
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });
}

