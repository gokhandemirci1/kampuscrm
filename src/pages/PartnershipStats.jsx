import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../utils/api';

const PartnershipStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/partnership-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">İş Birliği İstatistikleri</h1>
        <p className="text-gray-600">Kodlara göre müşteri sayısı ve toplam gelir</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Müşteri Sayısı Grafiği</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="code" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="customer_count" fill="#3b82f6" name="Müşteri Sayısı" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Toplam Gelir Grafiği</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="code" />
            <YAxis />
            <Tooltip formatter={(value) => `₺${value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`} />
            <Legend />
            <Bar dataKey="total_amount" fill="#10b981" name="Toplam Gelir (₺)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Gelir Dağılımı</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={stats}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ code, percent }) => `${code}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="total_amount"
            >
              {stats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₺${value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Detaylı İstatistikler</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kod
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri Sayısı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam Gelir
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ortalama Gelir/Müşteri
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.map((stat, index) => (
                <tr key={stat.code}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stat.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.customer_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₺{stat.total_amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₺
                    {stat.customer_count > 0
                      ? (stat.total_amount / stat.customer_count).toLocaleString('tr-TR', {
                          minimumFractionDigits: 2,
                        })
                      : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PartnershipStats;

