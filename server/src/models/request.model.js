import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required: true },
    units: { type: Number, min: 1, max: 10, required: true },
    urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    hospital: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [lng, lat]
    },
    notes: { type: String },
    status: { type: String, enum: ['open', 'matched', 'fulfilled', 'canceled'], default: 'open', index: true },
}, { timestamps: true });

requestSchema.index({ location: '2dsphere' });

const Request = mongoose.model('Request', requestSchema);
export default Request;