import type { Request, Response } from 'express';
import Message from '../models/Message.js';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching messages',
    });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { messageId, text } = req.body;

    if (!messageId || !text) {
      return res.status(400).json({
        success: false,
        message: 'Message ID and text are required',
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message thread not found',
      });
    }

    message.lastMessage = text;
    message.unread = false;
    message.timestamp = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error sending message',
    });
  }
};
