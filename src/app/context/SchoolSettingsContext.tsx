"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { schoolSettingsService, SchoolSettings } from '@/app/service/schoolSettingsService';

interface SchoolSettingsContextType {
  schoolSettings: SchoolSettings | null;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
}

const SchoolSettingsContext = createContext<SchoolSettingsContextType | undefined>(undefined);

export function SchoolSettingsProvider({ children }: { children: React.ReactNode }) {
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await schoolSettingsService.getSchoolSettings();
      
      if (response.success) {
        setSchoolSettings(response.data);
      } else {
        setError(response.error || 'Failed to fetch school settings');
      }
    } catch (err) {
      setError('An error occurred while fetching school settings');
      console.error('Error fetching school settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SchoolSettingsContext.Provider value={{
      schoolSettings,
      loading,
      error,
      refreshSettings
    }}>
      {children}
    </SchoolSettingsContext.Provider>
  );
}

export function useSchoolSettings() {
  const context = useContext(SchoolSettingsContext);
  if (context === undefined) {
    throw new Error('useSchoolSettings must be used within a SchoolSettingsProvider');
  }
  return context;
}
