import { useEffect, useCallback } from 'react';

import { useIndexedDB } from './UseIndexedDB.tsx';

const STORAGE_KEY = 'smart-notes-auto-backup';
const BACKUP_INTERVAL = 30 * 60 * 1000; // 30 минут

export const useAutoBackup = () => {
  const { getAllNotes } = useIndexedDB();

  // Автоматическое сохранение в localStorage
  const createAutoBackup = useCallback(async () => {
    try {
      const notes = await getAllNotes();
      const backup = {
        timestamp: new Date().toISOString(),
        notes,
        version: '1.0'
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(backup));
      console.log('Auto-backup created:', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Auto-backup failed:', error);
    }
  }, [getAllNotes]);

  // Восстановление из auto-backup
  const restoreFromAutoBackup = useCallback(async () => {
    try {
      const backupStr = localStorage.getItem(STORAGE_KEY);
      if (!backupStr) return null;

      const backup = JSON.parse(backupStr);
      return backup;
    } catch (error) {
      console.error('Restore from auto-backup failed:', error);
      return null;
    }
  }, []);

  // Запускаем авто-бэкап
  useEffect(() => {
    // Сразу создаем первый бэкап
    createAutoBackup();

    // И по таймеру
    const interval = setInterval(createAutoBackup, BACKUP_INTERVAL);

    // И при закрытии страницы
    const handleBeforeUnload = () => {
      createAutoBackup();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [createAutoBackup]);

  return {
    createAutoBackup,
    restoreFromAutoBackup,
  };
};
