import express from 'express';
import * as enquiryController from '../controllers/enquiryController.js';

const router = express.Router();

// Public route to create an enquiry
router.post('/', enquiryController.createEnquiry);

export default router;
