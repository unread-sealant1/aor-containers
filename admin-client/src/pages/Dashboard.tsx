import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  TrendingUp,
  Clock
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import apiClient from '../api/client';
import './Dashboard.css';

interface Stats {
  total: number;
  published: number;
  available: number;
  outOfStock: number;
  lowStock: number;
}

interface ProductSummary {
  _id: string;
  name: string;
  availability: string;
  stockQuantity: number;
}

interface DashboardData {
  stats: Stats;
  recentProducts: ProductSummary[];
  recentlyUpdated: ProductSummary[];
}

interface InventoryMetrics {
  locationMetrics: { location: string; totalStock: number }[];
  grandTotal: number;
}

interface AnalyticsData {
  date: string;
  orders: number;
  revenue: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [metrics, setMetrics] = useState<InventoryMetrics | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, metricsRes, analyticsRes] = await Promise.all([
          apiClient.get('/admin/stats'),
          apiClient.get('/admin/inventory-metrics'),
          apiClient.get('/admin/analytics')
        ]);

        if (statsRes.data.success && metricsRes.data.success && analyticsRes.data.success) {
          setData(statsRes.data.data);
          setMetrics(metricsRes.data.data);
          setAnalytics(analyticsRes.data.data);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'An error occurred while fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="empty-state">
        <div className="loading-spinner"></div>
        <p>Loading operations dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <AlertTriangle size={48} color="var(--color-danger)" />
        <p style={{ color: 'var(--color-danger)', marginTop: '1rem' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
          style={{ width: 'auto', marginTop: '1rem', padding: '0.5rem 1rem' }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data || !metrics) return null;

  const COLORS = ['#0B3C5D', '#F58220', '#4A90E2', '#50E3C2', '#B8CBBB'];

  return (
    <div className="dashboard-container">
      {/* Top Metrics Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Containers</div>
          <div className="stat-value">{data.stats.total}</div>
          <div className="stat-footer">
            <Package size={14} />
            <span>Across all locations</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-label">Available Stock</div>
          <div className="stat-value">{data.stats.available}</div>
          <div className="stat-footer">
            <CheckCircle2 size={14} />
            <span>Ready for order</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-label">Low Stock</div>
          <div className="stat-value">{data.stats.lowStock}</div>
          <div className="stat-footer">
            <AlertTriangle size={14} />
            <span>Needs attention</span>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-label">Out of Stock</div>
          <div className="stat-value">{data.stats.outOfStock}</div>
          <div className="stat-footer">
            <XCircle size={14} />
            <span>Zero units available</span>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        {/* Main Graph Section */}
        <div className="metrics-graph-card">
          <div className="card-header">
            <div className="header-title-group">
              <BarChart3 size={20} className="header-icon" />
              <div>
                <h3 className="card-title">Inventory Distribution</h3>
                <p className="card-subtitle">Total Stock: {metrics.grandTotal} units</p>
              </div>
            </div>
          </div>
          <div className="graph-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.locationMetrics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="location"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="totalStock" radius={[4, 4, 0, 0]} barSize={40}>
                  {metrics.locationMetrics.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke={COLORS[0]}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Orders"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS[1]}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Revenue (R)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supporting Panels */}
        <div className="dashboard-side-panels">
          <div className="section-card">
            <div className="section-header">
              <div className="header-title-group">
                <TrendingUp size={18} className="header-icon" />
                <h3 className="section-title">Recent Additions</h3>
              </div>
              <Link to="/admin/products" className="section-link">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="section-content">
              {data.recentProducts.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Container</th>
                      <th>Stock</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentProducts.map(product => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.stockQuantity}</td>
                        <td>
                          <span className={`status-badge ${
                            product.availability === 'Available' ? 'status-available' :
                            product.availability === 'Limited Availability' ? 'status-limited' : 'status-out'
                          }`}>
                            {product.availability}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">No recent products found</div>
              )}
            </div>
          </div>

          <div className="section-card">
            <div className="section-header">
              <div className="header-title-group">
                <Clock size={18} className="header-icon" />
                <h3 className="section-title">Recently Updated</h3>
              </div>
              <Link to="/admin/products" className="section-link">
                Manage <ArrowRight size={14} />
              </Link>
            </div>
            <div className="section-content">
              {data.recentlyUpdated.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Container</th>
                      <th>Stock</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentlyUpdated.map(product => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.stockQuantity}</td>
                        <td>
                          <span className={`status-badge ${
                            product.availability === 'Available' ? 'status-available' :
                            product.availability === 'Limited Availability' ? 'status-limited' : 'status-out'
                          }`}>
                            {product.availability}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">No recent updates found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
