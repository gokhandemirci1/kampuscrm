import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import { format } from 'date-fns';

const Financials = () => {
  const [financials, setFinancials] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancials();
  }, []);

  const fetchFinancials = async () => {
    try {
      const response = await api.get('/financials');
      setFinancials(response.data);
    } catch (error) {
      console.error('Error fetching financials:', error);
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

  if (!financials) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center text-red-600">Veriler yüklenemedi</div>
      </div>
    );
  }

  const chartData = [
    { name: 'Günlük', amount: finances.period.daily },
    { name: 'Haftalık', amount: finances.period.weekly },
    { name: 'Aylık', amount: finances.period.monthly },
    { name: 'Yıllık', amount: finances.period.yearly },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Finansal Veriler</h1>
        <p className="text-gray-600">Mali durum ve ödeme detayları</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-600 mb-1">Günlük Ciro</p>
          <p className="text-3xl font-bold text-blue-600">
            ₺{finances.period.daily.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-600 mb-1">Haftalık Ciro</p>
          <p className="text-3xl font-bold text-green-600">
            ₺{finances.period.weekly.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-600 mb-1">Aylık Ciro</p>
          <p className="text-3xl font-bold text-purple-600">
            ₺{finances.period.monthly.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-600 mb-1">Yıllık Ciro</p>
          <p className="text-3xl font-bold text-orange-600">
            ₺{finances.period.yearly.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Toplam Ciro</h2>
        <p className="text-4xl font-bold text-gray-900">
          ₺{finances.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Dönemsel Ciro Grafiği</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `₺${value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`} />
            <Legend />
            <Bar dataKey="amount" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Müşteri Ödeme Detayları</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {finances.details.map((detail, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {detail.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₺{detail.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(detail.transaction_date), 'dd MMM yyyy HH:mm')}
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

export default Financials;

