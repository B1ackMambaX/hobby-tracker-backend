import mongoose from 'mongoose';

const TripTemplateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    budget: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    checklist: { type: [String], required: true },
    daysLength: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('TripTemplate', TripTemplateSchema);