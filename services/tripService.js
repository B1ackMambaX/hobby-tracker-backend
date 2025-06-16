import Trip from '../models/Trip.js';
import Task from '../models/Task.js';
import notificationService from './notificationService.js';
import spendService from './spendService.js';
import mongoose from 'mongoose';
import ApiError from '../exceptions/apiErrors.js';

class TripService {
    async getTripsByUserId(userId) {
        return await Trip.find({ userId });
    }

    async addTrip(tripData) {
        const trip = new Trip(tripData);
        return await trip.save();
    }

    async removeTrip(tripId) {
        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            throw ApiError.BadRequestError('Invalid trip ID');
        }

        // Находим все задачи поездки
        const tasks = await Task.find({ tripId });
        const taskIds = tasks.map(task => task._id);

        // Удаляем все связанные сущности
        await Promise.all([
            Task.deleteMany({ tripId }),
            spendService.removeSpendsByTripId(tripId),
            notificationService.deleteRemindersByTaskIds(taskIds)
        ]);

        // Удаляем саму поездку
        const result = await Trip.deleteOne({ _id: tripId });

        if (result.deletedCount === 0) {
            throw ApiError.BadRequestError('Trip not found');
        }

        return {
            success: true,
            deletedTasksCount: tasks.length,
            deletedSpendsCount: spends.length
        };
    }
}

export default new TripService();