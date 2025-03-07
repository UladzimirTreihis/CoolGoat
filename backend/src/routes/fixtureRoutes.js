// MIDDLEWARES ELIMINADOS

import { Router } from 'express';
import { getAllFixtures, getFixtureById } from '../controllers/fixtureController.js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.get('/fixtures', getAllFixtures);
router.get('/fixtures/:id', getFixtureById);
// router.get('/fixtures/filter', filterFixtures);

export default router;
