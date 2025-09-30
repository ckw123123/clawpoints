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
  const [settings, setSettings] = useState({
    chatbot_enabled: false, // Start with chatbot disabled
    whatsapp_integration_enabled: false,
    instagram_integration_enabled: false
  });

  const updateSettings = async (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
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