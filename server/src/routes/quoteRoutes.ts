import express from 'express';
import { submitQuote } from '../controllers/quoteController';

const router = express.Router();

router.post('/submit', submitQuote);

export default router;
