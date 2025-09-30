import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext-public';
import { useSettings } from '../contexts/SettingsContext-demo';
import { useLanguage } from '../contexts/LanguageContext';
// Demo version - AWS Amplify imports removed
import Chatbot from '../components/Chatbot-demo';
import LanguageToggle from '../components/LanguageToggle';

const Profile = () => {
  const { userProfile, setUserProfile } = useAuth();
  const { isChatbotEnabled, settings } = useSettings();
  const { t, language, changeLanguage } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    gender: userProfile?.gender || '',
    birthday: userProfile?.birthday || '',
    phone: userProfile?.phone || '',
    email: userProfile?.email || '',
    selectedBranch: userProfile?.selectedBranch || (settings.branches?.[0]?.id || '')
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Demo version - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUserProfile(prev => ({
        ...prev,
        ...formData
      }));

      setIsEditing(false);
      alert('Profile updated successfully! (Demo mode)');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Demo version - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
      alert('Password updated successfully! (Demo mode)');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{t('profile')}</h2>
          <div className="flex items-center space-x-3">
            <LanguageToggle />
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {t('editProfile')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Branch Selection */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">{t('selectBranch')}</h3>
        <select
          name="selectedBranch"
          value={formData.selectedBranch}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          {settings.branches?.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name} - {branch.location}
            </option>
          ))}
        </select>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">{t('personalInfo')}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('username')}
            </label>
            <input
              type="text"
              value={userProfile?.username || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('fullName')}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('gender')}
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
              }`}
            >
              <option value="">{t('selectGender')}</option>
              <option value="male">{t('male')}</option>
              <option value="female">{t('female')}</option>
              <option value="other">{t('other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('birthday')}
            </label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('phoneNumber')}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
              }`}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? t('saving') : t('saveChanges')}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: userProfile?.name || '',
                  gender: userProfile?.gender || '',
                  birthday: userProfile?.birthday || '',
                  phone: userProfile?.phone || '',
                  email: userProfile?.email || ''
                });
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{t('security')}</h3>
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              {t('changePassword')}
            </button>
          )}
        </div>

        {showPasswordForm && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('currentPassword')}
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('newPassword')}
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('confirmPassword')}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? t('updating') : t('updatePassword')}
              </button>
              <button
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Customer Service - Only show if enabled */}
      {isChatbotEnabled && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Customer Support</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">智能客服 / AI Assistant</p>
              <p className="text-sm text-gray-600">
                Get instant help with your points and rewards
              </p>
              <p className="text-xs text-gray-500">
                支援中文及英文 / Supports Chinese & English
              </p>
            </div>
            <button
              onClick={() => setIsChatbotOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <span>🤖</span>
              <span>Chat Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Contact Us Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">{t('contactUs')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* WhatsApp Contact */}
          <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="text-2xl">💬</div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{t('whatsappContact')}</p>
              <p className="text-sm text-gray-600">{settings.contact_whatsapp}</p>
            </div>
            <a
              href={`https://wa.me/${settings.contact_whatsapp?.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              {t('chatNow')}
            </a>
          </div>

          {/* Phone Contact */}
          <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="text-2xl">📞</div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{t('phoneContact')}</p>
              <p className="text-sm text-gray-600">{settings.contact_phone}</p>
            </div>
            <a
              href={`tel:${settings.contact_phone}`}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              {t('call')}
            </a>
          </div>
        </div>

        {/* Selected Branch Contact */}
        {formData.selectedBranch && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">{t('currentBranch')}</h4>
            {(() => {
              const selectedBranchData = settings.branches?.find(b => b.id === formData.selectedBranch);
              return selectedBranchData ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{selectedBranchData.name}</p>
                  <p className="text-sm text-gray-600">{selectedBranchData.location}</p>
                  <div className="flex space-x-4 text-sm">
                    <a
                      href={`https://wa.me/${selectedBranchData.whatsapp?.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800"
                    >
                      WhatsApp: {selectedBranchData.whatsapp}
                    </a>
                    <a
                      href={`tel:${selectedBranchData.phone}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {t('phoneNumber2')}: {selectedBranchData.phone}
                    </a>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>

      {/* Chatbot Component - Only render if enabled */}
      {isChatbotEnabled && (
        <Chatbot 
          isOpen={isChatbotOpen} 
          onClose={() => setIsChatbotOpen(false)} 
        />
      )}
    </div>
  );
};

export default Profile;