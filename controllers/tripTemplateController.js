import tripsTemplateService from '../services/tripsTemplateService.js';
import ApiError from '../exceptions/apiErrors.js';

class TripTemplateController {
    async getAll(req, res, next) {
        try {
            const templates = await tripsTemplateService.getAll();
            res.json(templates);
        } catch (e) {
            next(e);
        }
    }
    async add (req, res, next) {
        try {
            const { name, budget, description, imageUrl, checklist, daysLength } = req.body;

            if (!name || !budget || !description || !imageUrl || !checklist || !daysLength) {
                return next(ApiError.BadRequestError("All fields are required"));
            }

            const templateData = {
                ...req.body,
                createdBy: req.user.id
            };

            const template = await tripsTemplateService.createTemplate(templateData);
            res.status(201).json(template);
        } catch (e) {
            next(e);
        }
    }
}

export default new TripTemplateController();