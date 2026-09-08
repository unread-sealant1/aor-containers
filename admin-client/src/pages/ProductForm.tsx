import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Upload, Trash2 } from 'lucide-react';
import apiClient from '../api/client';
import { getImageUrl } from '../utils/imageUtils';
import './ProductForm.css';

interface ConditionPrice {
  condition: string;
  ownerCostUSD?: number;
  sellingPriceZAR?: number;
  markupPercentage?: number;
  isCustomMarkup?: boolean;
}

interface ProductSpecifications {
  length: string;
  width: string;
  height: string;
  internalLength: string;
  internalWidth: string;
  internalHeight: string;
  capacity: string;
  tareWeight: string;
  maximumPayload: string;
  doorWidth: string;
  doorHeight: string;
}

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  category: string;
  conditions: ConditionPrice[];
  specifications: ProductSpecifications;
  applications: string;
  stockQuantity: number;
  availability: string;
  featured: boolean;
  published: boolean;
}

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    category: 'Standard Containers',
    conditions: [{ condition: 'Used', ownerCostUSD: 0, isCustomMarkup: false }],
    specifications: {
      length: '', width: '', height: '',
      internalLength: '', internalWidth: '', internalHeight: '',
      capacity: '', tareWeight: '', maximumPayload: '',
      doorWidth: '', doorHeight: ''
    },
    applications: '',
    stockQuantity: 0,
    availability: 'Available',
    featured: false,
    published: false,
  });

  const [images, setImages] = useState<{ url: string; isPrimary: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<{ defaultExchangeRate: number; defaultMarkupPercentage: number } | null>(null);

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const [settingsRes] = await Promise.all([
          apiClient.get('/admin/settings')
        ]);

        if (settingsRes.data.success) {
          const settingsData = settingsRes.data.data[0] || {};
          setSettings({
            defaultExchangeRate: settingsData.defaultExchangeRate || 18.5,
            defaultMarkupPercentage: settingsData.defaultMarkupPercentage || 20
          });
        }
      } catch (err) {
        console.error('Failed to fetch settings', err);
      }
    };

    fetchInitData();

    if (isEdit && id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await apiClient.get(`/admin/containers/${id}`);
      const product = response.data.data;

      // Ensure conditions have a default 'condition' value to prevent validation errors
      const sanitizedConditions = (product.conditions || []).map((cond: any) => ({
        ...cond,
        condition: cond.condition || 'Used'
      }));

      setFormData({
        ...product,
        conditions: sanitizedConditions,
        applications: product.applications.join(', ')
      });
      setImages(product.images);
    } catch (err: any) {
      alert(`Failed to fetch product data: ${err.response?.data?.message || err.message}`);
      navigate('/admin/products');
    }
  };

  const calculatePrice = (ownerCost: number, markup: number, isCustom: boolean) => {
    if (!settings) return 0;
    const effectiveMarkup = isCustom ? markup : settings.defaultMarkupPercentage;
    return Math.round((ownerCost * settings.defaultExchangeRate) * (1 + effectiveMarkup / 100));
  };

  const handleConditionChange = (index: number, field: keyof ConditionPrice, value: any) => {
    const newConditions = [...formData.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };

    const cond = newConditions[index];
    const updatedSellingPrice = calculatePrice(
      cond.ownerCostUSD || 0,
      cond.markupPercentage || 0,
      cond.isCustomMarkup || false
    );

    newConditions[index] = { ...newConditions[index], sellingPriceZAR: updatedSellingPrice };
    setFormData({ ...formData, conditions: newConditions });
  };

  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, { condition: 'Used', ownerCostUSD: 0, isCustomMarkup: false }]
    });
  };

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter((_, i) => i !== index)
    });
  };

  const handleSpecChange = (field: keyof ProductSpecifications, value: string) => {
    setFormData({
      ...formData,
      specifications: { ...formData.specifications, [field]: value }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append('image', file);
    form.append('productId', isEdit ? id! : 'temp');

    try {
      const response = await apiClient.post('/admin/containers/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newImage = response.data.data;
      setImages([...images, { url: newImage.url, isPrimary: images.length === 0 }]);
    } catch (err: any) {
      alert(`Image upload failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const setPrimaryImage = (index: number) => {
    const newImages = images.map((img, i) => ({ ...img, isPrimary: i === index }));
    setImages(newImages);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        applications: formData.applications.split(',').map(s => s.trim()).filter(Boolean),
        images
      };

      if (isEdit) {
        await apiClient.put(`/admin/containers/${id}`, payload);
      } else {
        await apiClient.post('/admin/containers', payload);
      }
      navigate('/admin/products');
    } catch (err: any) {
      alert(`Error saving product: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-header">
        <h2>{isEdit ? 'Edit Container' : 'Add New Container'}</h2>
        <div className="header-actions">
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-ghost">
            <X size={18} /> Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            <Save size={18} /> {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="field-group">
            <label>Product Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="field-group">
            <label>Slug (URL friendly name)</label>
            <input type="text" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
          </div>
          <div className="field-group">
            <label>Category</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Standard Containers">Standard Containers</option>
              <option value="High Cube Containers">High Cube Containers</option>
              <option value="Refrigerated Containers">Refrigerated Containers</option>
              <option value="Open Top Containers">Open Top Containers</option>
              <option value="Flat Rack Containers">Flat Rack Containers</option>
              <option value="Side Opening Containers">Side Opening Containers</option>
              <option value="Storage Containers">Storage Containers</option>
            </select>
          </div>
          <div className="field-group">
            <label>Description</label>
            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
        </div>

        <div className="form-section">
          <h3>Pricing & Inventory</h3>
          <div className="conditions-container">
            <label>Pricing per Condition</label>
            {formData.conditions.map((cond, index) => (
              <div key={index} className="condition-pricing-box">
                <div className="condition-grid">
                  <div className="condition-left-col">
                    <div className="field-group">
                      <label>Condition</label>
                      <select value={cond.condition} onChange={e => handleConditionChange(index, 'condition', e.target.value)}>
                        <option value="New">New</option>
                        <option value="Used">Used</option>
                        <option value="New & Used">New & Used</option>
                        <option value="On Request">On Request</option>
                      </select>
                    </div>
                    <div className="field-group">
                      <label>Owner Cost (USD)</label>
                      <div className="price-input-group">
                        <span className="input-prefix">$</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={cond.ownerCostUSD || ''}
                          onChange={e => handleConditionChange(index, 'ownerCostUSD', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="condition-right-col">
                    <div className="markup-controls">
                      <div className="markup-toggle-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={cond.isCustomMarkup || false}
                            onChange={e => handleConditionChange(index, 'isCustomMarkup', e.target.checked)}
                          />
                          Custom Markup
                        </label>
                      </div>
                      <div className="markup-input-group">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Markup %"
                          disabled={!(cond.isCustomMarkup || false)}
                          value={cond.markupPercentage || ''}
                          onChange={e => handleConditionChange(index, 'markupPercentage', parseFloat(e.target.value) || 0)}
                        />
                        <span className="unit-label">%</span>
                      </div>
                    </div>
                    <div className="price-result-group">
                      <span className="result-label">Final Selling Price</span>
                      <div className="price-display-group">
                        <span className="input-prefix">R</span>
                        <span className="price-calculated">
                          {cond.sellingPriceZAR ? cond.sellingPriceZAR.toLocaleString() : 'Pending...'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => removeCondition(index)} className="btn-remove-condition">
                  <Trash2 size={14} /> Remove Condition
                </button>
              </div>
            ))}
            <button type="button" onClick={addCondition} className="btn-add-condition">Add Condition</button>
          </div>

          <div className="field-group">
            <label>Stock Quantity</label>
            <input type="number" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: parseInt(e.target.value) || 0})} />
          </div>
          <div className="field-group">
            <label>Availability</label>
            <select value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})}>
              <option value="Available">Available</option>
              <option value="Limited Availability">Limited Availability</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="On Request">On Request</option>
            </select>
          </div>
          <div className="status-toggles">
            <label className="toggle">
              <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
              Featured Product
            </label>
            <label className="toggle">
              <input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} />
              Published
            </label>
          </div>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-section">
          <h3>Specifications</h3>
          <div className="specs-grid">
            {(Object.keys(formData.specifications) as Array<keyof ProductSpecifications>).map(spec => (
              <div key={spec} className="field-group">
                <label>{spec.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                <input type="text" value={formData.specifications[spec]} onChange={e => handleSpecChange(spec, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Images</h3>
          <div className="image-upload-box">
            <label className="upload-label">
              <Upload size={24} />
              <span>Upload Image</span>
              <input type="file" onChange={handleImageUpload} hidden />
            </label>
          </div>
          <div className="image-preview-grid">
            {images.map((img, index) => (
              <div key={index} className={`image-preview ${img.isPrimary ? 'primary' : ''}`}>
                <img src={getImageUrl(img.url)} alt="Preview" />
                <div className="image-actions">
                  <button type="button" onClick={() => setPrimaryImage(index)} className="btn-set-primary">Set Primary</button>
                  <button type="button" onClick={() => removeImage(index)} className="btn-remove-img"><Trash2 size={14} /></button>
                </div>
                {img.isPrimary && <span className="primary-badge">Primary</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Applications</h3>
        <div className="field-group">
          <label>Typical Uses (comma separated)</label>
          <input type="text" placeholder="e.g. General Cargo, Storage, Mining" value={formData.applications} onChange={e => setFormData({...formData, applications: e.target.value})} />
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
