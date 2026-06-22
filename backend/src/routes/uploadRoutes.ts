import express from 'express';
import { uploadPDF, upload } from '../controllers/uploadController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/pdf', protect, upload.single('file'), uploadPDF);

export default router;
