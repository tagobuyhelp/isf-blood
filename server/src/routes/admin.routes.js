import express from 'express';
import { query, param, body } from 'express-validator';
import { validate } from '../middlewares/validator.middleware.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { listUsers, updateUser, listRequestsAdmin, listAudit, getSettings, updateSettings } from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/users', [query('role').optional().isString()], validate, listUsers);
router.patch('/users/:id', [param('id').isString(), body('role').optional().isString()], validate, updateUser);
router.get('/requests', [query('status').optional().isString()], validate, listRequestsAdmin);
router.get('/audit', [query('action').optional().isString()], validate, listAudit);
router.get('/settings', getSettings);
router.patch('/settings', updateSettings);

export default router;