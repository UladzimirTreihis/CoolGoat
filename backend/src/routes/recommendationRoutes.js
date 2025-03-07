
import { Router } from "express";
import { getRecommendedFixtures, addRecommendation, getHeartBeat } from "../controllers/recommendationController.js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.get("/heartbeat", getHeartBeat);
router.get("/recommendations", getRecommendedFixtures);
router.post("/recommendations", addRecommendation);

export default router;