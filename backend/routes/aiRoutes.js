import express from "express";
import { chatWithAI, vibeRecommendationController } from "../controllers/aiController.js";

const router = express.Router();

// POST /api/v1/ai/chat
router.post("/chat", chatWithAI);

// POST /api/v1/ai/vibe
router.post("/vibe", vibeRecommendationController);

export default router;