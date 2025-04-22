
import express from 'express';
import SpendController from '../controllers/spendController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:tripId', SpendController.getSpends);
router.post('/:tripId', SpendController.createSpend);
router.delete('/:id', SpendController.deleteSpend);

export default router;