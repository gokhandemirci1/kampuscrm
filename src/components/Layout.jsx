import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: '📊',
    },
    ...(user.can_manage_customers
      ? [
          {
            name: 'Müşteriler',
            path: '/customers',
            icon: '👥',
          },
        ]
      : []),
    ...(user.can_view_financials
      ? [
          {
            name: 'Finansal Veriler',
            path: '/financials',
            icon: '💰',
          },
        ]
      : []),
    ...(user.can_manage_partnership_codes
      ? [
          {
            name: 'İş Birliği Kodları',
            path: '/partnership-codes',
            icon: '🔑',
          },
        ]
      : []),
    ...(user.can_view_partnership_stats
      ? [
          {
            name: 'İş Birliği İstatistikleri',
            path: '/partnership-stats',
            icon: '📈',
          },
        ]
      : []),
    ...(user.can_manage_access
      ? [
          {
            name: 'Erişim Yönetimi',
            path: '/access-management',
            icon: '🔐',
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                location.pathname === item.path
                  ? 'bg-gray-800 text-white border-r-2 border-blue-500'
                  : ''
              }`}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <div className="mb-3">
            <p className="text-sm text-gray-400">Kullanıcı</p>
            <p className="text-white font-medium">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 bg-gray-900 text-white rounded-md md:hidden"
        >
          ☰
        </button>
      )}

      {/* Main content */}
      <div className={`${sidebarOpen ? 'md:ml-64' : ''} transition-all duration-300`}>
        <div className="min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

