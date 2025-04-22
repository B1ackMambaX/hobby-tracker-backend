
import taskService from '../services/taskService.js';
import ApiError from '../exceptions/apiErrors.js';

class TaskController {
    async getTasks(req, res, next) {
        try {
            const { tripId } = req.params;
            const tasks = await taskService.getTasksByTripId(tripId);
            res.json(tasks);
        } catch (e) {
            next(e);
        }
    }

    async createTask(req, res, next) {
        try {
            const taskData = { ...req.body, tripId: req.params.tripId };
            const task = await taskService.addTask(taskData);
            res.status(201).json(task);
        } catch (e) {
            next(e);
        }
    }

    async updateTask(req, res, next) {
        try {
            const { id } = req.params;
            const task = await taskService.updateTask(id, req.body);
            res.json(task);
        } catch (e) {
            next(e);
        }
    }

    async deleteTask(req, res, next) {
        try {
            const { id } = req.params;
            await taskService.removeTask(id);
            res.json({ success: true });
        } catch (e) {
            next(e);
        }
    }
}

export default new TaskController();