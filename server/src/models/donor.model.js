import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required: true },
    availability: { type: String, enum: ['available', 'unavailable'], default: 'available' },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [lng, lat]
    },
    lastDonationDate: { type: Date },
    donationHistory: [{
        date: { type: Date, required: true },
        hospital: { type: String, required: true, trim: true },
        units: { type: Number, required: true, min: 1, max: 10 }
    }],
}, { timestamps: true });

donorSchema.index({ location: '2dsphere' });

const Donor = mongoose.model('Donor', donorSchema);
export default Donor;