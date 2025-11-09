import express from 'express';
import { param, query } from 'express-validator';
import { validate } from '../middlewares/validator.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import { listNotifications, markNotificationRead } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/', protect, [query('unreadOnly').optional().isBoolean(), query('page').optional().isInt(), query('limit').optional().isInt()], validate, listNotifications);
router.post('/:id/read', protect, [param('id').isString()], validate, markNotificationRead);

export default router;