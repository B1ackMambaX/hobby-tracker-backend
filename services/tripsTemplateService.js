import TripTemplate from '../models/TripTemplate.js';
import User from '../models/userModel.js';
import ApiError from '../exceptions/apiErrors.js';

class TripsTemplateService {
    async getAll() {
        return await TripTemplate.find().populate('createdBy', 'email');
    }

    async getById(id) {
        const template = await TripTemplate.findById(id).populate('createdBy', 'email');
        if (!template) {
            throw ApiError.BadRequestError('Template not found');
        }
        return template;
    }

    async createTemplate(templateData) {
        return await TripTemplate.create(templateData);
    }
}

export default new TripsTemplateService();