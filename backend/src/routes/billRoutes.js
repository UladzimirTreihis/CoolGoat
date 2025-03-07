import express from 'express';
import { getBill } from '../controllers/billController.js';

const router = express.Router();

// GET route for fetching a bond by ID
router.get('/bill/:id', getBill);

export default router;