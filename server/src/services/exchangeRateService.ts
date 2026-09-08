import axios from 'axios';
import Setting from '../models/Setting.js';

export interface ExchangeRateResult {
  rate: number;
  base: string;
  target: string;
  lastUpdated: string;
}

const API_KEY = '2396a487bdc41f4ad3cbce3a';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

/**
 * Fetches the current USD to ZAR exchange rate
 */
export async function getLatestRate(): Promise<ExchangeRateResult> {
  try {
    const response = await axios.get(`${BASE_URL}/pair/USD/ZAR`);
    if (response.data && response.data.conversion_rate) {
      return {
        rate: response.data.conversion_rate,
        base: 'USD',
        target: 'ZAR',
        lastUpdated: new Date().toISOString(),
      };
    }
    throw new Error('Invalid response from exchange rate API');
  } catch (error: any) {
    console.error('Exchange rate fetch error:', error.message);
    throw new Error(`Failed to fetch exchange rate: ${error.message}`);
  }
}

/**
 * Syncs the latest rate directly into the Store Settings in MongoDB
 */
export async function syncExchangeRateToSettings(): Promise<ExchangeRateResult> {
  const rateData = await getLatestRate();

  await Setting.findOneAndUpdate(
    { key: 'storeSettings' },
    {
      $set: {
        'value.defaultExchangeRate': rateData.rate,
        'value.lastExchangeRateSync': rateData.lastUpdated
      }
    },
    { upsert: true, new: true }
  );

  return rateData;
}
