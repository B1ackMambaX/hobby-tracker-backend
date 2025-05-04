import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: {
        type: String,
        enum: ['done', 'inProgress'],
        default: 'inProgress'
    },
    date: { type: Date, default: Date.now },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true }
});

export default mongoose.model('Task', TaskSchema);