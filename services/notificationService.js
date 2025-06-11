import Notification from '../models/Notification.js';
import Task from '../models/Task.js';

class NotificationService {
    // Создание напоминания
    async createReminder(userId, taskId, message, remindAt) {
        return await Notification.create({
            userId,
            taskId,
            message,
            remindAt,
            status: 'pending'
        });
    }

    // Получение активных напоминаний
    async getActiveReminders(userId) {
        console.log("Searching reminders for user:", userId);
        const result = await Notification.find({
            userId,
            $or: [
                { status: 'pending', remindAt: { $lte: new Date() } },
                { status: 'postponed', remindAt: { $lte: new Date() } }
            ]
        }).populate('taskId');
        console.log("Found notifications:", result);
        return result;
    }

    // Отметить как выполненное
    async markAsDone(notificationId) {
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { status: 'done' },
            { new: true }
        ).populate('taskId');

        // Автоматически обновляем статус задачи
        await Task.findByIdAndUpdate(
            notification.taskId._id,
            { status: 'done' }
        );

        return notification;
    }

    // Отложить напоминание
    async postponeReminder(notificationId, until) {
        return await Notification.findByIdAndUpdate(
            notificationId,
            {
                status: 'postponed',
                postponedUntil: until,
                remindAt: until // Переносим время напоминания
            },
            { new: true }
        );
    }
    async getAllUserNotifications(userId) {
        return await Notification.find({ userId }).populate('taskId');
    }

}

export default new NotificationService();