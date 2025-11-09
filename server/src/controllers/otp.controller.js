import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

/**
 * @desc    Send OTP to user phone/email
 * @route   POST /api/v1/auth/send-otp
 * @access  Public
 */
export const sendOTP = async (req, res, next) => {
    try {
        const { phone, email } = req.body;
        if (!phone && !email) {
            return next(new ApiError(400, 'Provide phone or email to send OTP'));
        }
        // Skeleton: enqueue OTP send via provider
        res.status(200).json(new ApiResponse(200, { queued: true }, 'OTP send requested'));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Verify OTP code
 * @route   POST /api/v1/auth/verify-otp
 * @access  Public
 */
export const verifyOTP = async (req, res, next) => {
    try {
        const { code, phone, email } = req.body;
        if (!code || (!phone && !email)) {
            return next(new ApiError(400, 'Code and phone/email are required'));
        }
        // Skeleton: verify code against store
        res.status(200).json(new ApiResponse(200, { verified: true }, 'OTP verified'));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Link verified phone to authenticated account
 * @route   POST /api/v1/auth/link-phone
 * @access  Private
 */
export const linkPhoneToAccount = async (req, res, next) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return next(new ApiError(400, 'Phone is required'));
        }
        // Skeleton: persist phone to user profile
        res.status(200).json(new ApiResponse(200, { phoneLinked: true }, 'Phone linked to account'));
    } catch (error) {
        next(error);
    }
};