import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enquiry', // Linking messages to an enquiry/customer
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  lastMessage: {
    type: String,
    required: true,
  },
  unread: {
    type: Boolean,
    default: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Message', MessageSchema);
