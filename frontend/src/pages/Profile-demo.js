import React, { useState } from 'react';
import { useDemoAuth } from '../components/DemoAuthenticator';
import { useLanguage } from '../contexts/LanguageContext';
import { useSharedData } from '../contexts/SharedDataContext-demo';

const Profile = () => {
  const { user, userType, signOut } = useDemoAuth();
  const { t } = useLanguage();
  const { members, updateMember } = useSharedData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Get member data for regular users
  const memberData = userType === 'user' ? members.find(m => m.username === 'john_doe') : null;
  const profileData = memberData || {
    name: user.attributes.name,
    email: user.attributes.email,
    phone: '+1234567890',
    points: userType === 'admin' ? 5000 : userType === 'sales' ? 3000 : 1250,
    gender: 'male',
    birthday: '1990-01-01'
  };

  const handleEdit = () => {
    setFormData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (memberData) {
      updateMember(memberData.id, formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({});
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('profile')}</h1>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t('editProfile')}
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {t('save')}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('basicInformation')}</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('name')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('email')}
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('phone')}
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('gender')}
              </label>
              {isEditing ? (
                <select
                  value={formData.gender || ''}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="male">{t('male')}</option>
                  <option value="female">{t('female')}</option>
                  <option value="other">{t('other')}</option>
                </select>
              ) : (
                <p className="text-gray-900">{t(profileData.gender)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('birthday')}
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.birthday || ''}
                  onChange={(e) => handleChange('birthday', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">
                  {new Date(profileData.birthday).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('accountInformation')}</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('username')}
              </label>
              <p className="text-gray-900">{user.username}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('role')}
              </label>
              <p className="text-gray-900">
                {userType === 'admin' && t('admin')}
                {userType === 'sales' && t('sales')}
                {userType === 'user' && t('member')}
              </p>
            </div>

            {userType === 'user' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('currentPoints')}
                </label>
                <div className="text-2xl font-bold text-blue-600">
                  {profileData.points?.toLocaleString() || 0}
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={signOut}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {t('signOut')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">{t('demoProfile')}</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>{t('demoProfileDescription')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;