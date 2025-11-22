import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const PartnershipCodes = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState('');

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const response = await api.get('/partnership-codes');
      setCodes(response.data);
    } catch (error) {
      console.error('Error fetching codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCode.trim()) {
      alert('Lütfen bir kod girin');
      return;
    }

    try {
      await api.post('/partnership-codes', { code: newCode.trim() });
      setNewCode('');
      setShowModal(false);
      fetchCodes();
    } catch (error) {
      alert(error.response?.data?.detail || 'Kod eklenirken hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu kodu devre dışı bırakmak istediğinize emin misiniz?')) {
      return;
    }
    try {
      await api.delete(`/partnership-codes/${id}`);
      fetchCodes();
    } catch (error) {
      alert(error.response?.data?.detail || 'Kod silinirken hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">İş Birliği Kodları</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + Yeni Kod Ekle
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kod
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Oluşturulma Tarihi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {codes.map((code) => (
              <tr key={code.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {code.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      code.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {code.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(code.created_at).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {code.is_active && (
                    <button
                      onClick={() => handleDelete(code.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Devre Dışı Bırak
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Yeni Kod Ekle</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setNewCode('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kod *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="İş birliği kodu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setNewCode('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnershipCodes;

