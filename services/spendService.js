import Spend from '../models/Spend.js';
import ApiError from '../exceptions/apiErrors.js';

class SpendService {
    async getSpendsByTripId(tripId) {
        return await Spend.find({ tripId });
    }

    async addSpend(spendData) {
        const spend = new Spend(spendData);
        return await spend.save();
    }

    async removeSpend(spendId) {
        const result = await Spend.deleteOne({ _id: spendId });
        if (result.deletedCount === 0) {
            throw ApiError.BadRequestError('Spend not found');
        }
        return { success: true };
    }

    async removeSpendsByTripId(tripId) {
        const result = await Spend.deleteMany({ tripId });
        return result.deletedCount;
    }
}

export default new SpendService();