import React, { useState, useEffect } from 'react';
import { Save, Building2, DollarSign, CreditCard, RefreshCcw } from 'lucide-react';
import apiClient from '../api/client';
import './Settings.css';

interface StoreSettings {
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  vatNumber: string;
  currency: string;
  defaultExchangeRate: number;
  defaultMarkupPercentage: number;
  lastExchangeRateSync?: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiClient.get('/admin/settings');
        if (response.data.success) {
          setSettings(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch settings');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'An error occurred while fetching settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (field: keyof StoreSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError(null);
    try {
      const response = await apiClient.post('/admin/settings', {
        ...settings,
        key: 'storeSettings'
      });
      if (response.data.success) {
        // Trigger a global re-price of all containers to apply the new markup/rate
        await apiClient.post('/admin/containers/reprice');
        alert('Settings and all product prices updated successfully!');
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSyncRate = async () => {
    setSyncing(true);
    setError(null);
    try {
      const response = await apiClient.post('/admin/settings/sync-exchange-rate');
      if (response.data.success) {
        setSettings(prev => prev ? { ...prev, defaultExchangeRate: response.data.data.rate } : null);
        alert(`Exchange rate updated to ${response.data.data.rate} ZAR`);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to sync exchange rate');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <div className="empty-state">Loading settings...</div>;
  if (error && !settings) return <div className="empty-state" style={{ color: 'var(--color-danger)' }}>{error}</div>;

  if (!settings) return null;

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Store Settings</h1>
          <p className="page-subtitle">Manage your business details and global pricing configuration</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-form">
        <div className="settings-grid">
          {/* Business Information Section */}
          <div className="settings-section">
            <div className="section-header">
              <Building2 size={20} />
              <h3>Business Information</h3>
            </div>
            <div className="section-content">
              <div className="field-group full-width">
                <label>Store Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={e => handleInputChange('storeName', e.target.value)}
                  required
                />
              </div>
              <div className="field-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={e => handleInputChange('contactEmail', e.target.value)}
                  required
                />
              </div>
              <div className="field-group">
                <label>Contact Phone</label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={e => handleInputChange('contactPhone', e.target.value)}
                  required
                />
              </div>
              <div className="field-group full-width">
                <label>Physical Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={e => handleInputChange('address', e.target.value)}
                  required
                />
              </div>
              <div className="field-group full-width">
                <label>VAT Number</label>
                <input
                  type="text"
                  value={settings.vatNumber}
                  onChange={e => handleInputChange('vatNumber', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Pricing Configuration Section */}
          <div className="settings-section">
            <div className="section-header">
              <DollarSign size={20} />
              <h3>Pricing Configuration</h3>
            </div>
            <div className="section-content">
              <div className="field-group">
                <label>Base Currency</label>
                <select
                  value={settings.currency}
                  onChange={e => handleInputChange('currency', e.target.value)}
                >
                  <option value="ZAR">ZAR (South African Rand)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                </select>
              </div>
              <div className="field-group">
                <label>Exchange Rate (USD to {settings.currency})</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    step="0.01"
                    value={settings.defaultExchangeRate}
                    onChange={e => handleInputChange('defaultExchangeRate', parseFloat(e.target.value) || 0)}
                    required
                  />
                  <span className="unit-label">{settings.currency}</span>
                  <button
                    type="button"
                    className="btn-sync"
                    onClick={handleSyncRate}
                    disabled={syncing}
                    title="Sync with Live Market"
                  >
                    <RefreshCcw size={14} className={syncing ? 'spin' : ''} />
                  </button>
                </div>
              </div>
              <div className="field-group">
                <label>Global Default Markup (%)</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    step="0.01"
                    value={settings.defaultMarkupPercentage}
                    onChange={e => handleInputChange('defaultMarkupPercentage', parseFloat(e.target.value) || 0)}
                    required
                  />
                  <span className="unit-label">%</span>
                </div>
              </div>
              <div className="pricing-info-card">
                <CreditCard size={16} />
                <p>These settings determine the selling price for all containers unless a custom markup is specified per stock line.</p>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        <div className="form-actions">
          <button type="submit" disabled={saving} className="btn-save">
            {saving ? 'Saving...' : 'Save All Settings'}
            <Save size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
