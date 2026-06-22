import express from 'express';
import { chatWithAI, getRecommendations } from '../controllers/aiController';
import { protect } from '../middlewares/authMiddleware';
import rateLimit from '../middlewares/rateLimit';

const router = express.Router();

router.post('/chat', protect, chatWithAI);
router.post('/recommend', protect, getRecommendations);
// use configured rateLimit middleware instance from ../middlewares/rateLimit
router.post('/haku/chat', rateLimit, chatWithAI);

export default router;
