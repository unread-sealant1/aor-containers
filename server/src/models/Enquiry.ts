import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Converted', 'Closed'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
}, { timestamps: true });

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;
