import express from 'express';
import TripTemplateController from '../controllers/tripTemplateController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/', TripTemplateController.createTemplate);
router.get('/', TripTemplateController.getAll);

export default router;