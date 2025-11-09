import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middlewares/validator.middleware.js';
import { subscribePush } from '../controllers/push.controller.js';

const router = express.Router();

router.post('/subscribe',
    [
        body('endpoint').isString(),
        body('keys.p256dh').isString(),
        body('keys.auth').isString()
    ],
    validate,
    subscribePush
);

export default router;