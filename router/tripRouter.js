import express from 'express';
import TripController from '../controllers/tripController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', TripController.getTrips);
router.post('/', TripController.createTrip);
router.post('/apply-template', TripController.applyTemplate);
router.delete('/:id', TripController.deleteTrip);

export default router;