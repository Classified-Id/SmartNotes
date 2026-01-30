import { useCallback, useEffect, useState } from 'react';
import { INote, NewNote } from '../Types/Note.ts';

const DB_NAME = 'SmartNotesDB';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

export const useIndexedDB = () => {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  /**  Инициализация базы данных */
  useEffect(() => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
    };

    request.onsuccess = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      setDb(database);
      setIsInitialized(true);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      /** Создаем хранилище для заметок */
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: false,
        });

        /** Создаем индексы для поиска */
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };

    return () => {
      if (db) {
        db.close();
      }
    };
  }, []);

  /** Добавить заметку */
  const addNote = useCallback(
    async (note: NewNote): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject(new Error('Database not initialized'));
          return;
        }

        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const newNote: INote = {
          ...note,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const request = store.add(newNote);

        request.onsuccess = () => {
          resolve(newNote.id);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    },
    [db],
  );

  /** Получить все заметки */
  const getAllNotes = useCallback(async (): Promise<INote[]> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const notes = request.result.sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
        );
        resolve(notes);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }, [db]);

  /** Получить заметку по ID */
  const getNote = useCallback(
    async (id: string): Promise<INote | undefined> => {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject(new Error('Database not initialized'));
          return;
        }

        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    },
    [db],
  );

  /** Обновить заметку */
  const updateNote = useCallback(
    async (id: string, updates: Partial<INote>): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        if (!db) {
          reject(new Error('Database not initialized'));
          return;
        }

        // Сначала получаем текущую заметку
        const currentNote = await getNote(id);
        if (!currentNote) {
          reject(new Error('Note not found'));
          return;
        }

        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const updatedNote: INote = {
          ...currentNote,
          ...updates,
          updatedAt: new Date(),
        };

        const request = store.put(updatedNote);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    },
    [db, getNote],
  );

  /** Удалить заметку */
  const deleteNote = useCallback(
    async (id: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject(new Error('Database not initialized'));
          return;
        }

        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    },
    [db],
  );

  return {
    isInitialized,
    addNote,
    getAllNotes,
    getNote,
    updateNote,
    deleteNote,
  };
};
