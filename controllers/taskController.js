
import taskService from '../services/taskService.js';
import ApiError from '../exceptions/apiErrors.js';

class TaskController {
    async getTasks(req, res, next) {
        try {
            const { tripId } = req.params;
            if (!tripId) {
                return next(ApiError.BadRequestError("Parameter tripId is missing"));
            }

            const tasks = await taskService.getTasksByTripId(tripId);
            res.json(tasks);
        } catch (e) {
            next(e);
        }
    }

    async createTask(req, res, next) {
        try {
            const { tripId } = req.params;
            if (!tripId) {
                return next(ApiError.BadRequestError("Parameter tripId is missing"));
            }

            const { name } = req.body;
            if (!name) {
                return next(ApiError.BadRequestError("Task name is required"));
            }

            // Добавляем userId из авторизации
            const taskData = {
                ...req.body,
                tripId,
                userId: req.user.id
            };

            const task = await taskService.addTask(taskData);
            res.status(201).json(task);
        } catch (e) {
            next(e);
        }
    }

    async updateTask(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                return next(ApiError.BadRequestError("Parameter id is missing"));
            }

            if (Object.keys(req.body).length === 0) {
                return next(ApiError.BadRequestError("No data provided for update"));
            }

            const task = await taskService.updateTask(id, req.body);
            res.json(task);
        } catch (e) {
            next(e);
        }
    }

    async deleteTask(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                return next(ApiError.BadRequestError("Parameter id is missing"));
            }

            await taskService.removeTask(id);
            res.json({ success: true });
        } catch (e) {
            next(e);
        }
    }
}

export default new TaskController();