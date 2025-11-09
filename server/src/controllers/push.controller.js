import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export const subscribePush = async (req, res, next) => {
    try {
        const { endpoint, keys } = req.body;
        if (!endpoint || !keys?.p256dh || !keys?.auth) {
            return next(new ApiError(400, 'Invalid push subscription payload'));
        }
        res.status(200).json(new ApiResponse(200, { subscribed: true }, 'Push subscribed'));
    } catch (error) { next(error); }
};