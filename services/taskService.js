import Task from '../models/Task.js';
import ApiError from '../exceptions/apiErrors.js';
import notificationService from './notificationService.js';

class TaskService {
    async getTasksByTripId(tripId) {
        return await Task.find({ tripId });
    }

    async addTask(taskData) {
        if (!taskData.userId) {
            throw new Error('userId is required for notifications');
        }

        const task = await Task.create(taskData);

        if (taskData.date) {
            const taskDate = new Date(taskData.date);
            const now = new Date();

            // Очищаем время у taskDate (делаем 00:00)
            taskDate.setHours(0, 0, 0, 0);

            // Дата напоминания — за 1 день
            const oneDayBefore = new Date(taskDate);
            oneDayBefore.setDate(oneDayBefore.getDate() - 1);

            // Также обнуляем время у даты "сегодня"
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let reminderDate = null;

            if (oneDayBefore >= today) {
                reminderDate = oneDayBefore;
            } else if (taskDate >= today) {
                reminderDate = taskDate;
            }

            if (reminderDate) {
                await notificationService.createReminder(
                    taskData.userId,
                    task._id,
                    `Не забудьте: ${taskData.name}`,
                    reminderDate
                );
            } else {
                console.log('Не удалось создать уведомление — задача в прошлом.');
            }
        }

        return task;
    }

    async removeTask(taskId) {
        const result = await Task.deleteOne({ _id: taskId });
        if (result.deletedCount === 0) {
            throw ApiError.BadRequestError('Task not found');
        } else {
            await notificationService.deleteRemindersByTaskId(taskId);
        }
        return { success: true };
    }

    async updateTask(taskId, newData) {
        const task = await Task.findByIdAndUpdate(taskId, newData, { new: true });
        if (!task) {
            throw ApiError.BadRequestError('Task not found');
        }
        return task;
    }
}

export default new TaskService();