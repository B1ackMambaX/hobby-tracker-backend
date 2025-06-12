import tripService from '../services/tripService.js';
import tripsTemplateService from '../services/tripsTemplateService.js';
import taskService from '../services/taskService.js';
import ApiError from '../exceptions/apiErrors.js';
import notificationService from '../services/notificationService.js';

class TripController {
    async getTrips(req, res, next) {
        try {
            // проверку не надо, т.к. userId берется из authMiddleware
            const trips = await tripService.getTripsByUserId(req.user.id);
            res.json(trips);
        } catch (e) {
            next(e);
        }
    }

    async createTrip(req, res, next) {
        try {
            const { name, startDate, endDate, budget } = req.body;
            if (!name || !startDate || !endDate || !budget) {
                return next(ApiError.BadRequestError("Missing required fields: name, startDate, endDate or budget"));
            }

            const tripData = { ...req.body, userId: req.user.id };
            const trip = await tripService.addTrip(tripData);
            res.status(201).json(trip);
        } catch (e) {
            next(e);
        }
    }

    async deleteTrip(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                return next(ApiError.BadRequestError("Parameter id is missing"));
            }

            await tripService.removeTrip(id);
            res.json({ success: true });
        } catch (e) {
            next(e);
        }
    }

    async applyTemplate(req, res, next) {
        try {
            const { startDate, endDate, templateId } = req.body;
            const userId = req.user.id;
            // Валидация дат
            const now = new Date();
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start < now) {
                throw ApiError.BadRequestError('Дата начала не может быть в прошлом');
            }
            if (end <= start) {
                throw ApiError.BadRequestError('Дата окончания должна быть после даты начала');
            }
            // Получаем шаблон
            const template = await tripsTemplateService.getById(templateId);

            // Создаем путешествие
            const trip = await tripService.addTrip({
                name: template.name,
                startDate,
                endDate,
                budget: template.budget,
                userId
            });

            // Создаем задачи и напоминания
            const tasksWithReminders = await Promise.all(
                template.checklist.map(async (taskName) => {
                    // Создаем задачу
                    const task = await taskService.addTask({
                        name: taskName,
                        tripId: trip._id,
                        userId,
                        status: 'inProgress'
                    });

                    // Создаем напоминание за день до начала поездки
                    const reminderDate = new Date(startDate);
                    reminderDate.setDate(reminderDate.getDate() - 1); // Напоминание за 1 день до начала

                    await notificationService.createReminder(
                        userId,
                        task._id,
                        `Напоминание: ${taskName}`,
                        reminderDate
                    );

                    return task;
                })
            );

            res.status(201).json({
                trip,
                tasks: tasksWithReminders
            });
        } catch (e) {
            next(e);
        }
    }
}

export default new TripController();