import Task from '../models/Task.js';
import ApiError from '../exceptions/apiErrors.js';

class TaskService {
    async getTasksByTripId(tripId) {
        return await Task.find({ tripId });
    }

    async addTask(taskData) {
        const task = new Task(taskData);
        return await task.save();
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
        return task;
    }
}

export default new TaskService();