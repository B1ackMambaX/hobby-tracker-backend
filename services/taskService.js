import Task from '../models/Task.js';
import ApiError from '../exceptions/apiErrors.js';
import notificationService from './notificationService.js';

class TaskService {
    async getTasksByTripId(tripId) {
        return await Task.find({ tripId });
    }

    async addTask(taskData) {
        // Добавляем проверку userId
        if (!taskData.userId) {
            throw new Error('userId is required for notifications');
        }

        const task = await Task.create(taskData);

        // Создаём уведомление (напоминание через 24 часа)
        await notificationService.createReminder(
            taskData.userId, // Должен передаваться из контроллера
            task._id,
            `Не забудьте: ${taskData.name}`,
            new Date() // Через 24 часа
        );

        return task;
    }

    async removeTask(taskId) {
        const result = await Task.deleteOne({ _id: taskId });
        if (result.deletedCount === 0) {
            throw ApiError.BadRequestError('Task not found');
        }
        return { success: true };
    }

    async updateTask(taskId, newData) {
        const task = await Task.findByIdAndUpdate(taskId, newData, { new: true });
        if (!task) {
            throw ApiError.BadRequestError('Task not found');
        }
        if (newData.status === 'done') {
            await notificationService.createNotification(
                task.userId,
                task._id,
                `Задача "${task.name}" выполнена!`
            );
        }
        return task;
    }
}

export default new TaskService();