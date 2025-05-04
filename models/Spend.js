import mongoose from 'mongoose';

const SpendSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        enum: ['transport', 'food', 'residence', 'other'],
        required: true
    },
    amount: { type: Number, required: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true }
}, { timestamps: true });

export default mongoose.model('Spend', SpendSchema);