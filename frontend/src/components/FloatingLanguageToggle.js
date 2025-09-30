import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const FloatingLanguageToggle = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center space-x-1 bg-white rounded-full shadow-lg border p-1">
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1 text-sm rounded-full font-medium transition-all ${
            language === 'en' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage('zh')}
          className={`px-3 py-1 text-sm rounded-full font-medium transition-all ${
            language === 'zh' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          中文
        </button>
      </div>
    </div>
  );
};

export default FloatingLanguageToggle;