import { Router } from 'express';
import { addFavourite, getFavourites, removeFavourite } from '../controllers/favouritesController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);
router.get('/', getFavourites);
router.post('/', addFavourite);
router.delete('/:itemId', removeFavourite);

export default router;
