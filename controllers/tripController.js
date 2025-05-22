import tripService from '../services/tripService.js';
import tripsTemplateService from '../services/tripsTemplateService.js';
import taskService from '../services/taskService.js';
import ApiError from '../exceptions/apiErrors.js';

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

            // Валидация
            if (!startDate || !endDate || !templateId) {
                return next(ApiError.BadRequestError("Missing required fields"));
            }
            const userId = req.user.id;
            // Получаем шаблон
            const template = await tripsTemplateService.getById(templateId);

            // Создаем путешествие
            const tripData = {
                name: template.name,
                startDate,
                endDate,
                budget: template.budget,
                userId
            };
            const trip = await tripService.addTrip(tripData);

            // Создаем задачи из чеклиста
            const tasks = await Promise.all(
                template.checklist.map(item =>
                    taskService.addTask({
                        name: item,
                        tripId: trip._id,
                        status: 'inProgress'
                    })
                )
            );

            res.status(201).json({
                trip,
                tasks
            });
        } catch (e) {
            next(e);
        }
    }
}

export default new TripController();