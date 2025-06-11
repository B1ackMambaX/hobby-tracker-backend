import notificationService from '../services/notificationService.js';
import ApiError from '../exceptions/apiErrors.js';

class NotificationController {
    // Получить активные напоминания для проверки
    async getActive(req, res, next) {
        try {
            console.log("Current time:", new Date()); //текущее время
            const reminders = await notificationService.getActiveReminders(req.user.id);
            console.log("Found reminders:", reminders); // найденные уведомления
            res.json(reminders);
        } catch (e) {
            next(e);
        }
    }

    // Отметить как выполненное
    async markDone(req, res, next) {
        try {
            const { id } = req.params;
            const notification = await notificationService.markAsDone(id);
            res.json(notification);
        } catch (e) {
            next(e);
        }
    }

    // Отложить напоминание
    async postpone(req, res, next) {
        try {
            const { id } = req.params;
            const { until } = req.body; // "2025-06-13T12:00:00"

            if (!until) {
                throw ApiError.BadRequestError('Не указана дата откладывания');
            }

            const notification = await notificationService.postponeReminder(id, new Date(until));
            res.json(notification);
        } catch (e) {
            next(e);
        }
    }
}

export default new NotificationController();