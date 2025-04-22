
import express from 'express';
import TaskController from '../controllers/taskController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:tripId', TaskController.getTasks);
router.post('/:tripId', TaskController.createTask);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export default router;