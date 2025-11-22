import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AccessManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    can_manage_customers: false,
    can_view_financials: false,
    can_manage_partnership_codes: false,
    can_view_partnership_stats: false,
    can_manage_access: false,
  });
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData);
      } else {
        await api.post('/users', formData);
      }
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.detail || 'Kullanıcı işleminde hata oluştu');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      can_manage_customers: user.can_manage_customers,
      can_view_financials: user.can_view_financials,
      can_manage_partnership_codes: user.can_manage_partnership_codes,
      can_view_partnership_stats: user.can_view_partnership_stats,
      can_manage_access: user.can_manage_access,
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!confirm('Bu kullanıcının erişimini kaldırmak istediğinize emin misiniz?')) {
      return;
    }
    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.detail || 'Kullanıcı silinirken hata oluştu');
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      can_manage_customers: false,
      can_view_financials: false,
      can_manage_partnership_codes: false,
      can_view_partnership_stats: false,
      can_manage_access: false,
    });
  };

  const canDeleteUser = (user) => {
    const protectedEmails = ['gokhan@kampus.com', 'emre@kampus.com'];
    return !protectedEmails.includes(user.email);
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
        <h1 className="text-3xl font-bold text-gray-800">Erişim Yönetimi</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + Yeni Kullanıcı Ekle
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                E-posta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Müşteri Yönetimi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Finansal Veriler
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İş Birliği Kodları
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İş Birliği İstatistikleri
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Erişim Yönetimi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {user.can_manage_customers ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✗</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {user.can_view_financials ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✗</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {user.can_manage_partnership_codes ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✗</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {user.can_view_partnership_stats ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✗</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {user.can_manage_access ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✗</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Düzenle
                  </button>
                  {canDeleteUser(user) && (
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Sil
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
                </h2>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!!editingUser}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Şifre *
                    </label>
                    <input
                      type="password"
                      required={!editingUser}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-700">Yetkiler</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.can_manage_customers}
                      onChange={(e) =>
                        setFormData({ ...formData, can_manage_customers: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <span>Müşteri Yönetimi</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.can_view_financials}
                      onChange={(e) =>
                        setFormData({ ...formData, can_view_financials: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <span>Finansal Veriler</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.can_manage_partnership_codes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          can_manage_partnership_codes: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span>İş Birliği Kodları</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.can_view_partnership_stats}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          can_view_partnership_stats: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span>İş Birliği İstatistikleri</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.can_manage_access}
                      onChange={(e) =>
                        setFormData({ ...formData, can_manage_access: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <span>Erişim Yönetimi</span>
                  </label>
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
                    {editingUser ? 'Güncelle' : 'Kaydet'}
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

export default AccessManagement;

