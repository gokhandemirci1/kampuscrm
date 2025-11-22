import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Financials from './pages/Financials';
import PartnershipCodes from './pages/PartnershipCodes';
import PartnershipStats from './pages/PartnershipStats';
import AccessManagement from './pages/AccessManagement';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="customers"
            element={
              <ProtectedRoute requiredPermission="can_manage_customers">
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="financials"
            element={
              <ProtectedRoute requiredPermission="can_view_financials">
                <Financials />
              </ProtectedRoute>
            }
          />
          <Route
            path="partnership-codes"
            element={
              <ProtectedRoute requiredPermission="can_manage_partnership_codes">
                <PartnershipCodes />
              </ProtectedRoute>
            }
          />
          <Route
            path="partnership-stats"
            element={
              <ProtectedRoute requiredPermission="can_view_partnership_stats">
                <PartnershipStats />
              </ProtectedRoute>
            }
          />
          <Route
            path="access-management"
            element={
              <ProtectedRoute requiredPermission="can_manage_access">
                <AccessManagement />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

