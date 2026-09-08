import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware.js';
import Enquiry from '../models/Enquiry.js';
import Product from '../models/Product.js';
import { emailService } from '../services/emailService.js';

export const getEnquiries = async (req: AuthRequest, res: Response) => {
  try {
    const { status, priority } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const enquiries = await Enquiry.find(filter)
      .populate('productId', 'name category')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: enquiries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEnquiryStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status, priority },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.json({ success: true, data: enquiry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEnquiry = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await Enquiry.findByIdAndDelete(id);
    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const enquiryData = req.body;
    const enquiry = new Enquiry(enquiryData);
    await enquiry.save();

    // Send notification email to admin
    try {
      await emailService.sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@aorcontainers.com',
        subject: 'New Container Enquiry Received',
        text: `A new enquiry has been received from ${enquiryData.customerName} (${enquiryData.customerEmail}).\n\nMessage: ${enquiryData.message}`,
        html: `<p>A new enquiry has been received from <strong>${enquiryData.customerName}</strong> (${enquiryData.customerEmail}).</p><p><strong>Message:</strong><br>${enquiryData.message.replace(/\\n/g, '<br>')}</p>`,
      });
    } catch (emailError) {
      console.error('SMTP Error:', emailError);
      // We don't fail the request if only the email fails, but we log it.
    }

    res.status(201).json({ success: true, data: enquiry });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
