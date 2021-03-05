import express from 'express';
import * as dotenv from 'dotenv';

// Configure environment variables
dotenv.config();

// Setup server
const app = express();

app.get(',', (_, res) => {
  res.json({ message: 'Hello world' });
});

const serverPort = process.env.PORT || 8080;
app.listen(serverPort, () => console.log(`Server running on PORT ${serverPort}`));
