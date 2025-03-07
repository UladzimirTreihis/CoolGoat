// MIDDLEWARES ELIMINADOS

import express from 'express';
import { createBondRequest, getAllBonds, getUserBonds, getBondById } from '../controllers/bondController.js';
import sendJobToJobsMaster from '../utils/sendJobToJobsMaster.js';

const router = express.Router();

// POST route for creating a bond purchase request
router.post('/create', createBondRequest);

// GET route for fetching all bond requests
router.get('/', getAllBonds);

// GET route for fetching all bond requests for a given user
router.get('/user', getUserBonds);

// GET route for fetching a bond by ID
router.get('/:id', getBondById);

export default router;
