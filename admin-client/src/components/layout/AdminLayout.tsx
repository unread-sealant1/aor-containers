import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Bell,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const navItems = [
  {
    group: 'Overview',
    items: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    group: 'Inventory',
    items: [
      {
        name: 'Stock',
        icon: Box,
        children: [
          { name: 'View Stock', path: '/admin/products' },
          { name: 'Add Stock', path: '/admin/products/new' },
        ]
      },
    ]
  },
  {
    group: 'Operations',
    items: [
      { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
      { name: 'Enquiries', path: '/admin/enquiries', icon: Bell },
      { name: 'Messages', path: '/admin/messages', icon: Bell },
    ]
  },
  {
    group: 'Content',
    items: [
      { name: 'Media', path: '/admin/media', icon: Box },
    ]
  },
  {
    group: 'Administration',
    items: [
      { name: 'Settings', path: '/admin/settings', icon: Settings },
      { name: 'Customers', path: '/admin/customers', icon: User },
      { name: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
    ]
  },
];

const pageMetadata: Record<string, { title: string; description: string }> = {
  '/admin/dashboard': { title: 'Operations Dashboard', description: 'Real-time overview of inventory and orders' },
  '/admin/products': { title: 'Container Stock', description: 'Manage live inventory and pricing' },
  '/admin/products/new': { title: 'Add Stock', description: 'Register a new container stock line' },
  '/admin/enquiries': { title: 'Customer Enquiries', description: 'Manage and track product leads' },
  '/admin/messages': { title: 'Communications', description: 'Customer messaging center' },
  '/admin/media': { title: 'Media Library', description: 'Manage container image assets' },
  '/admin/settings': { title: 'System Settings', description: 'Global store and pricing configuration' },
  '/admin/orders': { title: 'Order Management', description: 'Fulfill and track customer requests' },
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const currentMetadata = pageMetadata[location.pathname] || {
    title: location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard',
    description: 'Administrative management'
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <div className="sidebar-header">
          {sidebarOpen && (
            <div className="sidebar-brand-container">
              <span className="sidebar-brand">AOR</span>
              <span className="sidebar-brand-sub">CONTAINERS</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sidebar-toggle">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((group, groupIdx) => (
            <div key={groupIdx}>
              {sidebarOpen && <h3 className="nav-group-title">{group.group}</h3>}
              <div className="nav-list">
                {group.items.map((item, itemIdx) => {
                  const hasChildren = 'children' in item;
                  const Icon = item.icon;

                  return (
                    <div key={itemIdx}>
                      {hasChildren ? (
                        <div className="nav-dropdown">
                          <button
                            onClick={() => setExpandedMenu(expandedMenu === item.name ? null : item.name)}
                            className={`nav-item ${isActive(item.children![0].path) ? 'active' : ''}`}
                          >
                            <div className="nav-item-content">
                              <Icon size={20} />
                              {sidebarOpen && <span className="nav-item-text">{item.name}</span>}
                            </div>
                            {sidebarOpen && <ChevronRight size={16} className={`nav-chevron ${expandedMenu === item.name ? 'rotated' : ''}`} />}
                          </button>
                          {sidebarOpen && expandedMenu === item.name && (
                            <div className="nav-submenu">
                              {item.children!.map((child, childIdx) => (
                                <Link
                                  key={childIdx}
                                  to={child.path}
                                  className={`nav-submenu-item ${isActive(child.path) ? 'active' : ''}`}
                                >
                                  {child.name}
                                </Link>
                                ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                        >
                          <Icon size={20} />
                          {sidebarOpen && <span className="nav-item-text">{item.name}</span>}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="nav-item-text">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-title-group">
            <h2 className="admin-header-title">{currentMetadata.title}</h2>
            <p className="admin-header-subtitle">{currentMetadata.description}</p>
          </div>
          <div className="admin-user-profile">
            <div className="user-info">
              <p className="user-email">{user?.email || 'Admin'}</p>
              <p className="user-role">{user?.role || 'administrator'}</p>
            </div>
            <div className="user-avatar">
              {user?.email?.[0].toUpperCase() || 'A'}
            </div>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
