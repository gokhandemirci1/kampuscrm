import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [partnershipCodes, setPartnershipCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    class_level: '',
    camps: [],
    prices: [],
    partnership_code: '',
    previous_yks_rank: '',
    city: '',
  });
  const [campInput, setCampInput] = useState('');
  const [priceInput, setPriceInput] = useState('');

  useEffect(() => {
    fetchCustomers();
    fetchPartnershipCodes();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnershipCodes = async () => {
    try {
      const response = await api.get('/partnership-codes');
      setPartnershipCodes(response.data.filter(code => code.is_active));
    } catch (error) {
      console.error('Error fetching partnership codes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const customerData = {
        ...formData,
        camps: formData.camps.filter(c => c.trim() !== ''),
        prices: formData.prices.map(p => parseFloat(p) || 0),
        partnership_code: formData.partnership_code || null,
        previous_yks_rank: formData.previous_yks_rank ? parseInt(formData.previous_yks_rank) : null,
      };
      await api.post('/customers', customerData);
      setShowModal(false);
      resetForm();
      fetchCustomers();
    } catch (error) {
      alert(error.response?.data?.detail || 'Müşteri eklenirken hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz? (Ödemesi alınmadığı için silinecek)')) {
      return;
    }
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (error) {
      alert(error.response?.data?.detail || 'Müşteri silinirken hata oluştu');
    }
  };

  const addCamp = () => {
    if (campInput.trim()) {
      setFormData({
        ...formData,
        camps: [...formData.camps, campInput.trim()],
        prices: [...formData.prices, 0],
      });
      setCampInput('');
    }
  };

  const removeCamp = (index) => {
    const newCamps = formData.camps.filter((_, i) => i !== index);
    const newPrices = formData.prices.filter((_, i) => i !== index);
    setFormData({ ...formData, camps: newCamps, prices: newPrices });
  };

  const updatePrice = (index, value) => {
    const newPrices = [...formData.prices];
    newPrices[index] = parseFloat(value) || 0;
    setFormData({ ...formData, prices: newPrices });
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      phone: '',
      email: '',
      class_level: '',
      camps: [],
      prices: [],
      partnership_code: '',
      previous_yks_rank: '',
      city: '',
    });
    setCampInput('');
    setPriceInput('');
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
        <h1 className="text-3xl font-bold text-gray-800">Müşteri Yönetimi</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + Yeni Müşteri
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İsim-Soyisim
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                E-posta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sınıf
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kamplar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Toplam Tutar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kod
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {customer.full_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.class_level || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {customer.camps.join(', ') || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₺{customer.prices.reduce((a, b) => a + b, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.partnership_code || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Yeni Müşteri Ekle</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İsim-Soyisim *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sınıf
                    </label>
                    <input
                      type="text"
                      value={formData.class_level}
                      onChange={(e) => setFormData({ ...formData, class_level: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Şehir
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Önceki YKS Derecesi
                    </label>
                    <input
                      type="number"
                      value={formData.previous_yks_rank}
                      onChange={(e) => setFormData({ ...formData, previous_yks_rank: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İş Birliği Kodu
                  </label>
                  <select
                    value={formData.partnership_code}
                    onChange={(e) => setFormData({ ...formData, partnership_code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Kod Seçin</option>
                    {partnershipCodes.map((code) => (
                      <option key={code.id} value={code.code}>
                        {code.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kamp ve Fiyatları
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Kamp adı"
                      value={campInput}
                      onChange={(e) => setCampInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCamp();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addCamp}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Ekle
                    </button>
                  </div>
                  {formData.camps.map((camp, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={camp}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                      <input
                        type="number"
                        placeholder="Fiyat"
                        value={formData.prices[index] || ''}
                        onChange={(e) => updatePrice(index, e.target.value)}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md"
                        step="0.01"
                      />
                      <button
                        type="button"
                        onClick={() => removeCamp(index)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
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

export default Customers;

