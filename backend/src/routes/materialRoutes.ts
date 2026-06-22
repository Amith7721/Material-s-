import express from 'express';
import { getMaterials, getMaterialById, createMaterial, replicateMaterial, advancedSearch } from '../controllers/materialController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = express.Router();

// Advanced search endpoint
router.get('/search/advanced', advancedSearch);

router.route('/')
  .get(getMaterials)
  .post(protect, authorize('Admin', 'Researcher'), createMaterial);

router.route('/:id')
  .get(getMaterialById);

router.post('/:id/replica', protect, authorize('Admin', 'Researcher'), replicateMaterial);

export default router;
