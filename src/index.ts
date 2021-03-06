import express from 'express';
import * as dotenv from 'dotenv';

import routes from './routes';
import { defaultErrorHandler } from './utils/error';

// Configure environment variables
dotenv.config();

// Setup server
const app = express();
app.use(express.json());

app.get('', (_, res) => {
  res.json({ message: 'Notification System API v1' });
});

// Configure routes
app.use(routes);

// Configure default error handler
app.use(defaultErrorHandler);

const serverPort = process.env.PORT || 8080;
app.listen(serverPort, () => console.log(`Server running on PORT ${serverPort}`));
