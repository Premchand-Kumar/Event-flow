import express from 'express';
import { getEvents, createEvent } from '../controllers/eventController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/', authenticate, createEvent);

export default router;
