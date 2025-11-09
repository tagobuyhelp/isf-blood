import express from 'express';
import { searchDonors, topDonors, getDonorById } from '../controllers/donor.controller.js';
import { validate } from '../middlewares/validator.middleware.js';
import { query, param } from 'express-validator';

const router = express.Router();

router.get('/search',
    [
        query('lat').isFloat().withMessage('lat must be a number'),
        query('lng').isFloat().withMessage('lng must be a number'),
        query('radiusKm').optional().isInt({ min: 1, max: 100 }).withMessage('radiusKm 1-100')
    ],
    validate,
    searchDonors
);

router.get('/top',
    [
        query('bloodType').optional().isString().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood type')
    ],
    validate,
    topDonors
);

router.get('/:id',
    [
        param('id').isMongoId().withMessage('Invalid donor id'),
        query('lat').optional().isFloat().withMessage('lat must be a number'),
        query('lng').optional().isFloat().withMessage('lng must be a number'),
        query('radiusKm').optional().isInt({ min: 1, max: 100 }).withMessage('radiusKm 1-100')
    ],
    validate,
    getDonorById
);

export default router;