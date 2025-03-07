// routes/matchRoutes.js
import express from 'express';
import { getUpcomingMatches } from '../controllers/workerController.js';

const router = express.Router();

// Route to get upcoming matches based on user ID
router.get('/upcoming-matches/:userId', getUpcomingMatches);

export default router;
