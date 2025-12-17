import { useState, useEffect, useCallback } from 'react';
import { PomodoroSettings, DEFAULT_SETTINGS } from '../../lib/types';
import { getSettings, saveSettings } from '../../lib/storage';

export function useSettings() {
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSettings().then((loadedSettings) => {
      setSettings(loadedSettings);
      setIsLoading(false);
    });
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<PomodoroSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await saveSettings(newSettings);

    chrome.runtime.sendMessage({
      type: 'UPDATE_SETTINGS',
      payload: newSettings,
    });
  }, [settings]);

  return {
    settings,
    updateSettings,
    isLoading,
  };
}
