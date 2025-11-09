import { ApiResponse } from '../utils/apiResponse.js';
import Donor from '../models/donor.model.js';
import Request from '../models/request.model.js';

/**
 * @desc    Public stats summary
 * @route   GET /api/v1/public/stats
 * @access  Public
 */
export const getPublicStats = async (req, res, next) => {
    try {
        const [donorsCount, activeRequests, fulfilledRequests] = await Promise.all([
            Donor.countDocuments({}),
            Request.countDocuments({ status: 'open' }),
            Request.countDocuments({ status: 'fulfilled' })
        ]);
        const counts = { donors: donorsCount, requestsFulfilled: fulfilledRequests, activeRequests };
        res.status(200).json(new ApiResponse(200, { counts }, 'Stats retrieved'));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Public testimonials
 * @route   GET /api/v1/public/testimonials
 * @access  Public
 */
export const getPublicTestimonials = async (req, res, next) => {
    try {
        // Skeleton: Replace with DB-backed testimonials
        const testimonials = [
            { id: 't1', name: 'A. Donor', message: 'Helping saves lives.' },
            { id: 't2', name: 'B. Recipient', message: 'Grateful for timely support.' }
        ];
        res.status(200).json(new ApiResponse(200, { testimonials }, 'Testimonials retrieved'));
    } catch (error) {
        next(error);
    }
};