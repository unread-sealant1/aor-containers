import express from 'express';
import type { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import type { QuoteRequest } from '../models/QuoteRequest';
import nodemailer from 'nodemailer';
import { PostgrestError } from '@supabase/supabase-js';

export const submitQuote = async (req: Request, res: Response) => {
  try {
    const quoteData = req.body;

    // Map camelCase from request to snake_case for database
    const dbQuoteData = {
      ...quoteData,
      delivery_address: quoteData.deliveryAddress,
    };
    delete dbQuoteData.deliveryAddress;

    // 1. Save to Supabase
    const { data, error } = await supabase
      .from('quote_requests')
      .insert([dbQuoteData])
      .select()
      .single();

    if (error) throw error;

    const newQuote = data;

    // 2. Email Notification (Configured via .env)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'sales@aorcontainers.co.za', // Replace with actual AOR email
      subject: `New Quote Request: ${quoteData.product} - ${quoteData.name}`,
      text: `You have a new quote request from ${quoteData.name} (${quoteData.company}).
      Product: ${quoteData.product}
      Quantity: ${quoteData.quantity}
      Condition: ${quoteData.condition}
      Location: ${quoteData.province}, ${quoteData.country}
      Notes: ${quoteData.notes}

      Contact: ${quoteData.email} | ${quoteData.phone}`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({ success: true, message: 'Quote request submitted successfully!', data: newQuote });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
