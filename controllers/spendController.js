import spendService from '../services/spendService.js';
import ApiError from '../exceptions/apiErrors.js';

class SpendController {
    async getSpends(req, res, next) {
        try {
            const { tripId } = req.params;
            if (!tripId) {
                return next(ApiError.BadRequestError("Parameter tripId is missing"));
            }

            const spends = await spendService.getSpendsByTripId(tripId);
            res.json(spends);
        } catch (e) {
            next(e);
        }
    }

    async createSpend(req, res, next) {
        try {
            const { tripId } = req.params;
            if (!tripId) {
                return next(ApiError.BadRequestError("Parameter tripId is missing"));
            }

            const { name, category, amount } = req.body;
            if (!name || !category || !amount) {
                return next(ApiError.BadRequestError("Missing required fields: name, category or amount"));
            }

            const spendData = { ...req.body, tripId: req.params.tripId };
            const spend = await spendService.addSpend(spendData);
            res.status(201).json(spend);
        } catch (e) {
            next(e);
        }
    }

    async deleteSpend(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                return next(ApiError.BadRequestError("Parameter id is missing"));
            }

            await spendService.removeSpend(id);
            res.json({ success: true });
        } catch (e) {
            next(e);
        }
    }
}

export default new SpendController();