import tripService from '../services/tripService.js';
import ApiError from '../exceptions/apiErrors.js';

class TripController {
    async getTrips(req, res, next) {
        try {
            const trips = await tripService.getTripsByUserId(req.user.id);
            res.json(trips);
        } catch (e) {
            next(e);
        }
    }

    async createTrip(req, res, next) {
        try {
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
            await tripService.removeTrip(id);
            res.json({ success: true });
        } catch (e) {
            next(e);
        }
    }
}

export default new TripController();