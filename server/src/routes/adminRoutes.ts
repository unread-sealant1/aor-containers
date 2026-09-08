import express from 'express';
import multer from 'multer';
import { authenticateAdmin, authorizeRole } from '../middleware/authMiddleware.js';
import * as adminController from '../controllers/adminController.js';
import * as enquiryController from '../controllers/enquiryController.js';
import * as mediaController from '../controllers/mediaController.js';
import * as settingsController from '../controllers/settingsController.js';
import * as orderController from '../controllers/orderController.js';
import { getMessages, sendMessage } from '../controllers/messageController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Dashboard
router.get('/stats', authenticateAdmin, adminController.getDashboardStats);
router.get('/inventory-metrics', authenticateAdmin, adminController.getInventoryMetrics);
router.get('/analytics', authenticateAdmin, adminController.getAnalyticsData);
router.get('/recent-orders', authenticateAdmin, adminController.getRecentOrders);
router.get('/recent-activity', authenticateAdmin, adminController.getRecentActivity);

// Categories
router.get('/containers/categories', authenticateAdmin, adminController.getCategories);
router.post('/containers/categories', authenticateAdmin, adminController.createCategory);
router.put('/containers/categories/:id', authenticateAdmin, adminController.updateCategory);
router.delete('/containers/categories/:id', authenticateAdmin, adminController.deleteCategory);

// Containers
router.get('/containers', authenticateAdmin, adminController.getAllContainers);
router.get('/containers/:id', authenticateAdmin, adminController.getContainerById);
router.post('/containers', authenticateAdmin, adminController.createContainer);
router.put('/containers/:id', authenticateAdmin, adminController.updateContainer);
router.delete('/containers/:id', authenticateAdmin, adminController.deleteContainer);
router.patch('/containers/publish', authenticateAdmin, adminController.togglePublish);
router.post('/containers/reprice', authenticateAdmin, adminController.repriceProducts);

// Enquiries
router.get('/enquiries', authenticateAdmin, enquiryController.getEnquiries);
router.patch('/enquiries/:id', authenticateAdmin, enquiryController.updateEnquiryStatus);
router.delete('/enquiries/:id', authenticateAdmin, enquiryController.deleteEnquiry);

// Images
router.post('/containers/upload', authenticateAdmin, upload.single('image'), adminController.uploadImage);
router.patch('/containers/images/primary', authenticateAdmin, adminController.setPrimaryImage);
router.delete('/containers/images', authenticateAdmin, adminController.deleteImage);

// Media
router.get('/media', authenticateAdmin, mediaController.getAllMedia);
router.delete('/media/:id', authenticateAdmin, mediaController.deleteMedia);

// Orders
router.get('/orders', authenticateAdmin, orderController.getOrders);
router.get('/orders/:id', authenticateAdmin, orderController.getOrderDetail);
router.patch('/orders/:id/status', authenticateAdmin, orderController.updateOrderStatus);
router.patch('/orders/:id/notes', authenticateAdmin, orderController.updateOrderAdminNotes);

// Customers
router.get('/customers', authenticateAdmin, adminController.getCustomers);

// Audit Logs
router.get('/audit-logs', authenticateAdmin, adminController.getAuditLogs);

// Settings
router.get('/settings', authenticateAdmin, settingsController.getSettings);
router.post('/settings', authenticateAdmin, settingsController.updateSettings);
router.post('/settings/sync-exchange-rate', authenticateAdmin, settingsController.syncExchangeRate);

// Admin Users
router.get('/admins', authorizeRole('super_admin'), adminController.getAdmins);
router.post('/admins', authorizeRole('super_admin'), adminController.createAdmin);
router.delete('/admins/:id', authorizeRole('super_admin'), adminController.deleteAdmin);

// Messages
router.get('/messages', authenticateAdmin, getMessages);
router.post('/messages', authenticateAdmin, sendMessage);

export default router;
