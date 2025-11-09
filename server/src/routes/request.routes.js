import express from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middlewares/validator.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import {
    createRequest,
    listRequests,
    getRequest,
    updateRequest,
    expressInterest,
    listInterests
} from '../controllers/request.controller.js';

const router = express.Router();

router.get('/',
    [
        query('status').optional().isIn(['open', 'matched', 'fulfilled', 'canceled']),
        query('bloodType').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    ],
    validate,
    listRequests
);

router.get('/:id', [param('id').isString()], validate, getRequest);

router.post('/',
    protect,
    [
        body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
        body('units').isInt({ min: 1, max: 10 }),
        body('urgency').optional().isIn(['low', 'medium', 'high']),
        body('hospital').isString().isLength({ min: 2 }),
        body('location.lat').isFloat(),
        body('location.lng').isFloat(),
        body('notes').optional().isString()
    ],
    validate,
    createRequest
);

router.patch('/:id', protect, [param('id').isString()], validate, updateRequest);

router.post('/:id/interest',
    protect,
    [
        param('id').isString(),
        body('available').isBoolean(),
        body('message').optional().isString().isLength({ max: 500 })
    ],
    validate,
    expressInterest
);

router.get('/:id/interests', protect, [param('id').isString()], validate, listInterests);

export default router;