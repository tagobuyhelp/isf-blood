import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export const listUsers = async (req, res, next) => {
    try { res.status(200).json(new ApiResponse(200, { results: [], page: 1, total: 0 }, 'Users list')); }
    catch (error) { next(error); }
};

export const updateUser = async (req, res, next) => {
    try { res.status(200).json(new ApiResponse(200, { user: {} }, 'User updated')); }
    catch (error) { next(error); }
};

export const listRequestsAdmin = async (req, res, next) => {
    try { res.status(200).json(new ApiResponse(200, { results: [], page: 1, total: 0 }, 'Requests list')); }
    catch (error) { next(error); }
};

export const listAudit = async (req, res, next) => {
    try { res.status(200).json(new ApiResponse(200, { events: [] }, 'Audit events')); }
    catch (error) { next(error); }
};

export const getSettings = async (req, res, next) => {
    try { res.status(200).json(new ApiResponse(200, { settings: {} }, 'Settings retrieved')); }
    catch (error) { next(error); }
};

export const updateSettings = async (req, res, next) => {
    try { res.status(200).json(new ApiResponse(200, { settings: {} }, 'Settings updated')); }
    catch (error) { next(error); }
};