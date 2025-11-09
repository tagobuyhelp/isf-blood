import express from 'express';
import { getPublicStats, getPublicTestimonials } from '../controllers/public.controller.js';

const router = express.Router();

router.get('/stats', getPublicStats);
router.get('/testimonials', getPublicTestimonials);

export default router;