import express from 'express';
import TripTemplateController from '../controllers/tripTemplateController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', TripTemplateController.getAll);
router.post('/', TripTemplateController.add);

export default router;