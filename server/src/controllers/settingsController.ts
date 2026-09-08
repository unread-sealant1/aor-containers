import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware.js';
import Setting from '../models/Setting.js';
import * as exchangeRateService from '../services/exchangeRateService.js';

const DEFAULT_SETTINGS = {
  storeName: 'AOR Containers',
  contactEmail: 'info@aorcontainers.com',
  contactPhone: '+27 12 345 6789',
  address: '123 Container Way, Industrial Area, South Africa',
  vatNumber: 'VAT123456789',
  currency: 'ZAR',
  defaultExchangeRate: 18.0,
  defaultMarkupPercentage: 25,
};

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const settingsDoc = await Setting.findOne({ key: 'storeSettings' });

    if (!settingsDoc) {
      const newSetting = await Setting.create({
        key: 'storeSettings',
        value: DEFAULT_SETTINGS,
      });
      return res.json({ success: true, data: newSetting.value });
    }

    res.json({ success: true, data: settingsDoc.value });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { body } = req;

    if (body.defaultExchangeRate !== undefined && (typeof body.defaultExchangeRate !== 'number' || body.defaultExchangeRate <= 0)) {
      return res.status(400).json({ success: false, message: 'Exchange rate must be a positive number.' });
    }
    if (body.defaultMarkupPercentage !== undefined && (typeof body.defaultMarkupPercentage !== 'number' || body.defaultMarkupPercentage < 0)) {
      return res.status(400).json({ success: false, message: 'Markup percentage cannot be negative.' });
    }

    const settingsDoc = await Setting.findOne({ key: 'storeSettings' });

    if (settingsDoc) {
      settingsDoc.value = { ...settingsDoc.value, ...body };
      await settingsDoc.save();
      res.json({ success: true, data: settingsDoc.value });
    } else {
      const newSetting = await Setting.create({
        key: 'storeSettings',
        value: { ...DEFAULT_SETTINGS, ...body },
      });
      res.json({ success: true, data: newSetting.value });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const syncExchangeRate = async (req: AuthRequest, res: Response) => {
  try {
    const result = await exchangeRateService.syncExchangeRateToSettings();
    res.json({
      success: true,
      message: `Exchange rate successfully updated to ${result.rate} ZAR`,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
