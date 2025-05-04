import Trip from '../models/Trip.js';
import ApiError from '../exceptions/apiErrors.js';

class TripService {
    async getTripsByUserId(userId) {
        return await Trip.find({ userId });
    }

    async addTrip(tripData) {
        const trip = new Trip({...tripData, status: 'active'});
        return await trip.save();
    }

    async removeTrip(tripId) {
        const result = await Trip.deleteOne({ _id: tripId });
        if (result.deletedCount === 0) {
            throw ApiError.BadRequestError('Trip not found');
        }
        return { success: true };
    }
}

export default new TripService();