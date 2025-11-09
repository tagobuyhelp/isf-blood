import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import Request from '../models/request.model.js';
import Interest from '../models/interest.model.js';
import mongoose from 'mongoose';

/**
 * @desc    Create a blood request
 * @route   POST /api/v1/requests
 * @access  Private (authenticated users)
 */
export const createRequest = async (req, res, next) => {
    try {
        const { bloodType, units, urgency = 'medium', hospital, location, notes } = req.body;
        if (!bloodType || !units || !hospital || !location?.lat || !location?.lng) {
            return next(new ApiError(400, 'Missing required fields'));
        }
        const requesterId = req.user?.id;
        if (!requesterId) return next(new ApiError(401, 'Authentication required'));

        const doc = await Request.create({
            requesterId,
            bloodType,
            units,
            urgency,
            hospital,
            location: { type: 'Point', coordinates: [Number(location.lng), Number(location.lat)] },
            notes
        });
        res.status(201).json(new ApiResponse(201, { request: doc }, 'Request created'));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    List requests with filters
 * @route   GET /api/v1/requests
 * @access  Public
 */
export const listRequests = async (req, res, next) => {
    try {
        const { status, bloodType, page = 1, limit = 20, lat, lng, radiusKm } = req.query;
        const query = {};
        if (status) query.status = status;
        if (bloodType) query.bloodType = bloodType;
        if (lat !== undefined && lng !== undefined && radiusKm) {
            query.location = {
                $near: {
                    $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
                    $maxDistance: Math.min(100 * 1000, Math.max(0.1, Number(radiusKm)) * 1000)
                }
            };
        }

        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(50, Math.max(1, Number(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [results, total] = await Promise.all([
            Request.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .populate('requesterId', 'name phone email'),
            Request.countDocuments(query)
        ]);

        res.status(200).json(new ApiResponse(200, { results, page: pageNum, total }, 'Requests list'));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get a specific request
 * @route   GET /api/v1/requests/:id
 * @access  Public
 */
export const getRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return next(new ApiError(400, 'Invalid request id'));
        const request = await Request.findById(id).populate('requesterId', 'name phone email');
        if (!request) return next(new ApiError(404, 'Request not found'));
        res.status(200).json(new ApiResponse(200, { request }, 'Request retrieved'));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a request
 * @route   PATCH /api/v1/requests/:id
 * @access  Private (owner/admin)
 */
export const updateRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return next(new ApiError(400, 'Invalid request id'));
        const allowed = ['status', 'notes', 'units', 'urgency'];
        const updates = {};
        for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];
        const request = await Request.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!request) return next(new ApiError(404, 'Request not found'));
        res.status(200).json(new ApiResponse(200, { request }, 'Request updated'));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Express interest in a request
 * @route   POST /api/v1/requests/:id/interest
 * @access  Private (donors)
 */
export const expressInterest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { available, message } = req.body;
        if (available === undefined) return next(new ApiError(400, 'available is required'));
        if (!mongoose.Types.ObjectId.isValid(id)) return next(new ApiError(400, 'Invalid request id'));
        const request = await Request.findById(id);
        if (!request) return next(new ApiError(404, 'Request not found'));
        const donorId = req.user?.id;
        if (!donorId) return next(new ApiError(401, 'Authentication required'));

        const existing = await Interest.findOne({ requestId: id, donorId });
        if (existing) {
            existing.status = available ? 'interested' : 'declined';
            existing.message = message;
            await existing.save();
            return res.status(200).json(new ApiResponse(200, { interest: existing }, 'Interest updated'));
        }

        const interest = await Interest.create({
            requestId: id,
            donorId,
            status: available ? 'interested' : 'declined',
            message
        });
        res.status(201).json(new ApiResponse(201, { interest }, 'Interest recorded'));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    List interests for a request
 * @route   GET /api/v1/requests/:id/interests
 * @access  Private (owner/admin)
 */
export const listInterests = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return next(new ApiError(400, 'Invalid request id'));
        const interests = await Interest.find({ requestId: id })
            .sort({ createdAt: -1 })
            .populate('donorId', 'name email phone');
        res.status(200).json(new ApiResponse(200, { interests }, 'Interests list'));
    } catch (error) {
        next(error);
    }
};