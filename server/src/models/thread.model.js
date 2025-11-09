import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema({
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', index: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
}, { timestamps: true });

const Thread = mongoose.model('Thread', threadSchema);
export default Thread;