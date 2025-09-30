import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext-public';
import { useLanguage } from '../contexts/LanguageContext';

const Login = () => {
  const { signIn, loading, error } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(formData.username, formData.password);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDemoLogin = (role) => {
    setFormData({ username: role, password: 'demo123' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('appName')}
          </h2>
          <p className="text-gray-600 mb-8">
            {t('appSlogan')}
          </p>
          <h3 className="text-xl font-semibold text-gray-800">
            {t('signInToYourAccount')}
          </h3>
        </div>

        {/* Demo Notice */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-600">🌐</span>
            <h4 className="font-medium text-green-800">Public Demo Version</h4>
          </div>
          <p className="text-sm text-green-700 mb-3">
            Experience the full ClawPoints system with simulated backend. All features work exactly like production!
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('admin')}
              className="px-3 py-2 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors"
            >
              👑 Admin
            </button>
            <button
              onClick={() => handleDemoLogin('sales')}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
            >
              💼 Sales
            </button>
            <button
              onClick={() => handleDemoLogin('member')}
              className="px-3 py-2 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
            >
              👤 Member
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                {t('username')}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('enterUsername')}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('enterPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('signingIn')}...
              </div>
            ) : (
              t('signIn')
            )}
          </button>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">{t('demoAccounts')}:</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <p><strong>{t('admin')}:</strong> admin / demo123</p>
              <p><strong>{t('sales')}:</strong> sales / demo123</p>
              <p><strong>{t('member')}:</strong> member / demo123</p>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t('dontHaveAccount')}{' '}
              <Link 
                to="/signup" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {t('signUp')}
              </Link>
            </p>
          </div>
        </form>

        {/* Production Notice */}
        <div className="text-center text-xs text-gray-500 mt-8 p-3 bg-gray-50 rounded-lg">
          <p className="mb-1">🔗 <strong>Production Ready:</strong> This demo shows the exact production interface</p>
          <p>Real version uses AWS Cognito authentication with email verification</p>
        </div>
      </div>
    </div>
  );
};

export default Login;