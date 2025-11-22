import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user.can_view_financials) {
          const response = await api.get('/financials');
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Hoş geldiniz, {user.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {user.can_manage_customers && (
          <Link
            to="/customers"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-2">👥</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Müşteriler</h3>
            <p className="text-gray-600 text-sm">Müşteri yönetimi</p>
          </Link>
        )}

        {user.can_view_financials && (
          <Link
            to="/financials"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-2">💰</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Finansal Veriler</h3>
            <p className="text-gray-600 text-sm">Mali durum</p>
          </Link>
        )}

        {user.can_manage_partnership_codes && (
          <Link
            to="/partnership-codes"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-2">🔑</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">İş Birliği Kodları</h3>
            <p className="text-gray-600 text-sm">Kod yönetimi</p>
          </Link>
        )}

        {user.can_view_partnership_stats && (
          <Link
            to="/partnership-stats"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-2">📈</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">İş Birliği İstatistikleri</h3>
            <p className="text-gray-600 text-sm">Kod performansı</p>
          </Link>
        )}
      </div>

      {user.can_view_financials && stats && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Finansal Özet</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Günlük</p>
              <p className="text-2xl font-bold text-blue-600">
                ₺{stats.period.daily.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Haftalık</p>
              <p className="text-2xl font-bold text-green-600">
                ₺{stats.period.weekly.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Aylık</p>
              <p className="text-2xl font-bold text-purple-600">
                ₺{stats.period.monthly.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Yıllık</p>
              <p className="text-2xl font-bold text-orange-600">
                ₺{stats.period.yearly.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

