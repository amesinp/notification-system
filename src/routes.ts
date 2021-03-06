import express from 'express';

import { subscribeToTopic, publishToTopic } from './handlers';

const router = express.Router();

router.post('/subscribe/:topic', subscribeToTopic);
router.post('/publish/:topic', publishToTopic);

export default router;
