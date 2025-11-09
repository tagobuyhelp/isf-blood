import { ApiResponse } from '../utils/apiResponse.js';

export const listNotifications = async (req, res, next) => {
    try {
        res.status(200).json(new ApiResponse(200, { notifications: [] }, 'Notifications list'));
    } catch (error) { next(error); }
};

export const markNotificationRead = async (req, res, next) => {
    try { res.status(200).json(new ApiResponse(200, { read: true }, 'Notification read')); }
    catch (error) { next(error); }
};