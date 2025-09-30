import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageTest = () => {
  const { t, language, changeLanguage } = useLanguage();

  return (
    <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-400 rounded p-3 text-sm z-50">
      <div>Current Language: <strong>{language}</strong></div>
      <div>Profile Translation: <strong>{t('profile')}</strong></div>
      <div className="mt-2 space-x-2">
        <button 
          onClick={() => changeLanguage('en')}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
        >
          EN
        </button>
        <button 
          onClick={() => changeLanguage('zh')}
          className="px-2 py-1 bg-red-500 text-white rounded text-xs"
        >
          中文
        </button>
      </div>
    </div>
  );
};

export default LanguageTest;