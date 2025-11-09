import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export const listThreads = async (req, res, next) => {
    try {
        res.status(200).json(new ApiResponse(200, { threads: [] }, 'Threads list'));
    } catch (error) {
        next(error);
    }
};

export const createThread = async (req, res, next) => {
    try {
        const { requestId, participantId } = req.body;
        if (!requestId || !participantId) return next(new ApiError(400, 'Missing fields'));
        res.status(201).json(new ApiResponse(201, { thread: { id: 'thr_1' } }, 'Thread created'));
    } catch (error) {
        next(error);
    }
};

export const getThreadMessages = async (req, res, next) => {
    try {
        res.status(200).json(new ApiResponse(200, { messages: [] }, 'Messages list'));
    } catch (error) {
        next(error);
    }
};

export const postMessage = async (req, res, next) => {
    try {
        const { content } = req.body;
        if (!content) return next(new ApiError(400, 'content is required'));
        res.status(201).json(new ApiResponse(201, { message: { id: 'msg_1' } }, 'Message created'));
    } catch (error) {
        next(error);
    }
};

export const markRead = async (req, res, next) => {
    try {
        res.status(200).json(new ApiResponse(200, { read: true }, 'Marked read'));
    } catch (error) {
        next(error);
    }
};