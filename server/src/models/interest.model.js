import mongoose from 'mongoose';

const interestSchema = new mongoose.Schema({
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true, index: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['interested', 'accepted', 'declined'], default: 'interested' },
    message: { type: String },
}, { timestamps: true });

const Interest = mongoose.model('Interest', interestSchema);
export default Interest;