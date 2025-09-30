import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Demo version with local state
export const SettingsProvider = ({ children }) => {
  // Use localStorage to persist settings across page refreshes in demo
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('demo-settings');
    return saved ? JSON.parse(saved) : {
      chatbot_enabled: false, // Start with chatbot disabled
      whatsapp_integration_enabled: false,
      instagram_integration_enabled: false,
      contact_whatsapp: '+852 9876 5432',
      contact_phone: '+852 2345 6789',
      branches: [
        { id: '1', name: 'Downtown Branch', location: '123 Main St, Downtown', whatsapp: '+852 9876 5432', phone: '+852 2345 6789' },
        { id: '2', name: 'Mall Branch', location: '456 Shopping Center, Mall District', whatsapp: '+852 9876 5433', phone: '+852 2345 6790' },
        { id: '3', name: 'Airport Branch', location: '789 Terminal Rd, Airport', whatsapp: '+852 9876 5434', phone: '+852 2345 6791' }
      ]
    };
  });

  const updateSettings = async (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    // Persist to localStorage for demo
    localStorage.setItem('demo-settings', JSON.stringify(updatedSettings));
    return { success: true };
  };

  const value = {
    settings,
    loading: false,
    error: null,
    fetchSettings: () => Promise.resolve(),
    updateSettings,
    // Convenience getters
    isChatbotEnabled: settings.chatbot_enabled,
    isWhatsAppEnabled: settings.whatsapp_integration_enabled,
    isInstagramEnabled: settings.instagram_integration_enabled
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};