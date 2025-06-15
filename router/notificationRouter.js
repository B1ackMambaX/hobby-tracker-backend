import express from 'express';
import NotificationController from '../controllers/notificationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import notificationService from '../services/notificationService.js';
const router = express.Router();

router.use(authMiddleware);
router.get('/active', NotificationController.getActive);
router.patch('/:id/done', NotificationController.markDone);
router.patch('/:id/postpone', NotificationController.postpone);

//для проверки:
router.get('/all', async (req, res) => {
    const notifications = await notificationService.getAllUserNotifications(req.user.id);
    res.json(notifications);
});
export default router;