import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: { type: Number, required: true },
    status: {
        type: String,
        enum: ['active', 'finished'],
        default: 'inProgress'
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Trip', TripSchema);