import { useCallback } from 'react';

export const useFullDBExport = () => {
  const exportFullDatabase = useCallback(async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SmartNotesDB');

      request.onsuccess = async (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // const transaction = db.transaction(['notes'], 'readonly');
        // const store = transaction.objectStore('notes');

        const allData: Record<string, unknown> = {};
        const storeNames = Array.from(db.objectStoreNames);

        for (const storeName of storeNames) {
          const storeTransaction = db.transaction([storeName], 'readonly');
          const currentStore = storeTransaction.objectStore(storeName);
          const data = await new Promise((resolveStore, rejectStore) => {
            const request = currentStore.getAll();
            request.onsuccess = () => resolveStore(request.result);
            request.onerror = () => rejectStore(request.error);
          });

          allData[storeName] = data;
        }

        db.close();

        const exportData = {
          database: 'SmartNotesDB',
          version: db.version,
          timestamp: new Date().toISOString(),
          data: allData,
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `smart-notes-full-db-${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        URL.revokeObjectURL(url);
        resolve(true);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }, []);

  return { exportFullDatabase };
};
