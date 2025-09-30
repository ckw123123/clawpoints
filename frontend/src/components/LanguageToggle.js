import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = ({ size = 'normal' }) => {
  const { language, changeLanguage } = useLanguage();

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    normal: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };

  return (
    <div className="flex items-center space-x-1 bg-white rounded-lg shadow-sm border p-1">
      <button
        onClick={() => changeLanguage('en')}
        className={`${sizeClasses[size]} rounded font-medium transition-colors ${
          language === 'en' 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('zh')}
        className={`${sizeClasses[size]} rounded font-medium transition-colors ${
          language === 'zh' 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        中文
      </button>
    </div>
  );
};

export default LanguageToggle;