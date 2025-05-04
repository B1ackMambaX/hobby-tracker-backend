import TripTemplate from '../models/TripTemplate.js';
import ApiError from '../exceptions/apiErrors.js';

class TripsTemplateService {
    async getAll() {
        return await TripTemplate.find();
    }

    async getById(id) {
        const template = await TripTemplate.findById(id);
        if (!template) {
            throw ApiError.BadRequestError('Template not found');
        }
        return template;
    }

    async createTemplate(data) {
        return await TripTemplate.create(data);
    }
}

export default new TripsTemplateService();