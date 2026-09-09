import React, { useState, useEffect } from 'react';
import { Clock, Package } from 'lucide-react';
import apiClient from '../api/client';
import './AuditLogs.css';

interface AuditLog {
  _id: string;
  productId: { name: string };
  previousQuantity: number;
  newQuantity: number;
  changedAt: string;
  note: string;
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/audit-logs');
        if (response.data.success) {
          setLogs(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch audit logs');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'An error occurred while fetching audit logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div className="empty-state">Loading audit logs...</div>;
  if (error) return <div className="empty-state" style={{ color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div className="audit-logs-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Audit Logs</h1>
          <p className="page-subtitle">Track every change in container stock levels</p>
        </div>
      </div>

      <div className="logs-table-container">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Product</th>
              <th>Stock Change</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id}>
                <td className="date-cell">
                  <div className="date-info">
                    <Clock size={14} />
                    {new Date(log.changedAt).toLocaleString()}
                  </div>
                </td>
                <td className="product-cell">
                  <div className="product-info">
                    <Package size={14} />
                    <strong>{log.productId.name}</strong>
                  </div>
                </td>
                <td className="change-cell">
                  <span className="change-text">
                    {log.previousQuantity} &rarr; <strong>{log.newQuantity}</strong>
                  </span>
                </td>
                <td className="note-cell">
                  <div className="note-text">{log.note || 'No notes provided'}</div>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="no-logs">No audit logs available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;
