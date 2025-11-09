import express from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middlewares/validator.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import { listThreads, createThread, getThreadMessages, postMessage, markRead } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/threads', protect, [query('requestId').optional().isString()], validate, listThreads);
router.post('/threads', protect, [body('requestId').isString(), body('participantId').isString()], validate, createThread);
router.get('/threads/:id', protect, [param('id').isString(), query('page').optional().isInt(), query('limit').optional().isInt()], validate, getThreadMessages);
router.post('/threads/:id/messages', protect, [param('id').isString(), body('content').isString()], validate, postMessage);
router.post('/threads/:id/read', protect, [param('id').isString(), body('messageId').isString()], validate, markRead);

export default router;