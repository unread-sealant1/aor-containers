import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Message from './models/Message.js';
import Enquiry from './models/Enquiry.js';

dotenv.config();

async function seedMessages() {
  try {
    console.log("Connecting to MongoDB for seeding messages...");
    await connectDB();

    // Get some enquiries to link messages to
    const enquiries = await Enquiry.find().limit(5);
    if (enquiries.length === 0) {
      console.log("No enquiries found. Please seed enquiries first.");
      process.exit(0);
    }

    const seedMessages = [
      {
        customerId: enquiries[0]!._id,
        customerName: enquiries[0]!.customerName,
        customerEmail: enquiries[0]!.customerEmail,
        subject: "Quote for 20ft Standard",
        lastMessage: "Hi, I'm interested in a 20ft container. Can you send pricing?",
        unread: true,
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        customerId: enquiries[1]?._id || enquiries[0]!._id,
        customerName: enquiries[1]?.customerName || enquiries[0]!.customerName,
        customerEmail: enquiries[1]?.customerEmail || enquiries[0]!.customerEmail,
        subject: "Urgent: Reefers Needed",
        lastMessage: "We need 3 refrigerated containers by next week. Is this possible?",
        unread: false,
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
      },
      {
        customerId: enquiries[2]?._id || enquiries[0]!._id,
        customerName: enquiries[2]?.customerName || enquiries[0]!.customerName,
        customerEmail: enquiries[2]?.customerEmail || enquiries[0]!.customerEmail,
        subject: "Modification Request",
        lastMessage: "Do you provide modification services for site offices?",
        unread: true,
        timestamp: new Date(Date.now() - 43200000), // 12 hours ago
      }
    ];

    console.log("Clearing existing messages...");
    await Message.deleteMany({});

    console.log("Inserting seed messages...");
    await Message.insertMany(seedMessages);

    console.log("✅ Messages seeded successfully!");
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seedMessages();
