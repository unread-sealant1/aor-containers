import React, { useState, useEffect } from 'react';
import { Trash2, Copy, Search, Image as ImageIcon } from 'lucide-react';
import apiClient from '../api/client';
import { getImageUrl } from '../utils/imageUtils';
import './Media.css';

interface MediaItem {
  _id: string;
  url: string;
  productId: string;
  productName: string;
  isPrimary: boolean;
}

const Media: React.FC = () => {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/media');
      if (response.data.success) {
        setImages(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch media');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the image for ${name}?`)) return;
    try {
      const response = await apiClient.delete(`/admin/media/${id}`);
      if (response.data.success) {
        setImages(images.filter(img => img._id !== id));
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      alert(`Error deleting image: ${err.response?.data?.message || err.message}`);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(getImageUrl(url));
      alert('URL copied to clipboard!');
    } catch (err) {
      alert('Failed to copy URL');
    }
  };

  const filteredImages = images.filter(img =>
    img.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && images.length === 0) return <div className="empty-state">Loading media library...</div>;
  if (error) return <div className="empty-state" style={{ color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div className="media-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Media Library</h1>
          <p className="page-subtitle">All images used across the container catalogue</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by product..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredImages.length > 0 ? (
        <div className="media-grid">
          {filteredImages.map((img) => (
            <div key={img._id} className="media-item">
              <div className="media-preview-wrapper">
                <img src={getImageUrl(img.url)} alt={img.productName} className="media-preview" />
                <div className="media-overlay">
                  <button onClick={() => copyUrl(img.url)} className="media-action-btn" title="Copy URL">
                    <Copy size={16} />
                  </button>
                  <button onClick={() => handleDelete(img._id, img.productName)} className="media-action-btn delete" title="Delete Image">
                    <Trash2 size={16} />
                  </button>
                </div>
                {img.isPrimary && <span className="primary-badge">Primary</span>}
              </div>
              <div className="media-info">
                <span className="media-product-name">{img.productName}</span>
                <div className="media-meta">
                  <span className="media-id">ID: {img._id.slice(-6)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <ImageIcon size={48} className="empty-icon" />
          <p>No images found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default Media;
