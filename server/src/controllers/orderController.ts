import type { Request, Response } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { emailService } from '../services/emailService.js';

const generateOrderNumber = async (): Promise<string> => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000).toString();
  const orderNumber = `AOR-${date}-${random}`;

  // Check for uniqueness
  const existing = await Order.findOne({ orderNumber });
  if (existing) return generateOrderNumber();

  return orderNumber;
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customer, productDetails, quantity, customerNotes } = req.body;

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return res.status(400).json({ success: false, message: 'Customer name, email, and phone are required.' });
    }

    if (!productDetails?.productId || !productDetails?.condition) {
      return res.status(400).json({ success: false, message: 'Product ID and condition are required.' });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'A valid quantity is required.' });
    }

    // 1. Fetch the most recent product data from DB
    const product = await Product.findById(productDetails.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // 2. Validate condition exists and has a selling price
    const conditionPrice = product.conditions.find(c => c.condition === productDetails.condition);
    if (!conditionPrice) {
      return res.status(400).json({ success: false, message: 'Selected condition is not available for this product.' });
    }

    if (!conditionPrice.sellingPriceZAR || conditionPrice.sellingPriceZAR <= 0) {
      return res.status(400).json({ success: false, message: 'Pricing for the selected condition is currently unavailable.' });
    }

    // 3. Stock Validation
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ success: false, message: `Insufficient stock. Only ${product.stockQuantity} available.` });
    }

    // 4. Authoritative Calculation
    const unitPriceZAR = conditionPrice.sellingPriceZAR;
    const totalZAR = unitPriceZAR * quantity;
    const orderNumber = await generateOrderNumber();

    // 5. Create Order with snapshots
    const order = new Order({
      orderNumber,
      customer,
      product: {
        productId: product._id,
        nameSnapshot: product.name,
        condition: conditionPrice.condition,
        location: product.specifications.location || 'Not specified',
      },
      quantity,
      pricing: {
        unitPriceZAR,
        totalZAR,
        currency: 'ZAR',
      },
      status: 'Pending',
      notes: {
        customerNotes,
      },
    });

    await order.save();

    // 6. Email Notification to AOR Admin
    try {
      await emailService.sendEmail({
        to: 'info@aorcontainers.com',
        subject: `New Container Order Request - ${orderNumber}`,
        text: `New Order Request Received\n\nOrder Number: ${orderNumber}\nContainer: ${product.name}\nLocation: ${product.specifications.location || 'Not specified'}\nCondition: ${conditionPrice.condition}\nQuantity: ${quantity}\nPrice: R${unitPriceZAR}\nTotal: R${totalZAR}\n\nCustomer: ${customer.name}\nEmail: ${customer.email}\nPhone: ${customer.phone}\nNotes: ${customerNotes || 'None'}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #0b3c5d; border-bottom: 2px solid #0b3c5d; padding-bottom: 10px;">New Container Order Request</h2>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <h3 style="color: #0b3c5d;">Product Details</h3>
            <p><strong>Container:</strong> ${product.name}</p>
            <p><strong>Location:</strong> ${product.specifications.location || 'Not specified'}</p>
            <p><strong>Condition:</strong> ${conditionPrice.condition}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Selling Price:</strong> R${unitPriceZAR.toLocaleString()}</p>
            <p><strong>Total:</strong> R${totalZAR.toLocaleString()}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <h3 style="color: #0b3c5d;">Customer Details</h3>
            <p><strong>Name:</strong> ${customer.name}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Phone:</strong> ${customer.phone}</p>
            <p><strong>Notes:</strong> ${customerNotes || 'None'}</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Order email notification failed:', emailError);
      // We don't throw here to avoid failing the order creation if only the email fails
    }

    res.status(201).json({
      success: true,
      data: {
        orderNumber,
        totalZAR,
        status: order.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req: any, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status.' });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Send confirmation email if status changed to 'Confirmed'
    if (status === 'Confirmed') {
      try {
        await emailService.sendEmail({
          to: order.customer.email,
          subject: `Order Confirmed - ${order.orderNumber}`,
          text: `Dear ${order.customer.name}, your order ${order.orderNumber} has been confirmed. We will contact you shortly regarding the next steps.`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
              <h2 style="color: #0b3c5d; border-bottom: 2px solid #0b3c5d; padding-bottom: 10px;">Order Confirmed!</h2>
              <p>Dear ${order.customer.name},</p>
              <p>We are pleased to inform you that your order request has been <strong>confirmed</strong>. Our team is now processing your request.</p>

              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
                <h3 style="margin-top: 0; color: #0b3c5d;">Order Summary</h3>
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Product:</strong> ${order.product.nameSnapshot}</p>
                <p><strong>Condition:</strong> ${order.product.condition}</p>
                <p><strong>Quantity:</strong> ${order.quantity}</p>
                <p><strong>Total Amount:</strong> R${order.pricing.totalZAR.toLocaleString()}</p>
              </div>

              <p>Our team will be in touch with you via phone or email to arrange payment and delivery/collection details.</p>
              <p>If you have any immediate questions, please feel free to reply to this email or contact us via WhatsApp.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #777; text-align: center;">
                Thank you for choosing AOR Containers.
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Customer confirmation email failed:', emailError);
        // We don't throw here to avoid failing the status update if only the email fails
      }
    }

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderAdminNotes = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { 'notes.adminNotes': adminNotes },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
