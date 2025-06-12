import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'done', 'postponed'],
        default: 'pending'
    },
    remindAt: { type: Date, required: true }, // Когда напомнить
    postponedUntil: { type: Date }, // Если отложено
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', NotificationSchema);