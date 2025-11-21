import { Router } from 'express';
import { deleteProfile, getProfile, updateProfile } from '../controllers/profileController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);
router.get('/me', getProfile);
router.put('/', updateProfile);
router.delete('/', deleteProfile);

export default router;
