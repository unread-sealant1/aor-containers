import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import Enquiries from './pages/Enquiries';
import Media from './pages/Media';
import Settings from './pages/Settings';
import Messages from './pages/Messages';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Customers from './pages/Customers';
import AuditLogs from './pages/AuditLogs';

const ProtectedRouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRouteWrapper>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRouteWrapper>
          } />
          <Route path="/admin/products" element={
            <ProtectedRouteWrapper>
              <AdminLayout>
                <ProductList />
              </AdminLayout>
            </ProtectedRouteWrapper>
          } />
          <Route path="/admin/products/new" element={
            <ProtectedRouteWrapper>
              <AdminLayout>
                <ProductForm />
              </AdminLayout>
            </ProtectedRouteWrapper>
          } />
          <Route path="/admin/products/:id/edit" element={
            <ProtectedRouteWrapper>
              <AdminLayout>
                <ProductForm />
              </AdminLayout>
            </ProtectedRouteWrapper>
          } />
          <Route path="/admin/enquiries" element={
            <ProtectedRouteWrapper>
              <AdminLayout>
                <Enquiries />
              </AdminLayout>
            </ProtectedRouteWrapper>
          } />
          <Route path="/admin/media" element={
            <ProtectedRouteWrapper>
              <AdminLayout>
                <Media />
              </AdminLayout>
            </ProtectedRouteWrapper>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRouteWrapper>
              <AdminLayout>
                <Settings />
              </AdminLayout>
            </ProtectedRouteWrapper>
          } />
          <Route path="/admin/messages" element={
            <ProtectedRouteWrapper>
              <AdminLayout>
                <Messages />
              </AdminLayout>
            </ProtectedRouteWrapper>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRouteWrapper>
              <AdminLayout>
                <Orders />
              </AdminLayout>
            </ProtectedRouteWrapper>
          } />
          <Route path="/admin/orders/:id" element={
            <ProtectedRouteWrapper>
              <AdminLayout>
                <OrderDetail />
              </AdminLayout>
            </ProtectedRouteWrapper>
          } />
          <Route path="/admin/customers" element={
            <ProtectedRouteWrapper>
              <AdminLayout>
                <Customers />
              </AdminLayout>
            </ProtectedRouteWrapper>
          } />
          <Route path="/admin/audit-logs" element={
            <ProtectedRouteWrapper>
              <AdminLayout>
                <AuditLogs />
              </AdminLayout>
            </ProtectedRouteWrapper>
          } />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
