import { useCallback } from 'react';

import { useIndexedDB } from './UseIndexedDB.tsx';

import type { INote } from '@/Types/Note.ts';

export const useNotesExport = () => {
  const { getAllNotes, addNote, deleteNote } = useIndexedDB();

  /** Экспорт всех заметок в JSON файл */
  const exportToJSON = useCallback(async () => {
    try {
      const notes = await getAllNotes();

      const dataStr = JSON.stringify(notes, null, 2);
      const dataUri =
        'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `smart-notes-backup-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      return { success: true, count: notes.length };
    } catch (error) {
      console.error('Export error:', error);
      return { success: false, error };
    }
  }, [getAllNotes]);

  /** Импорт из JSON файла */
  const importFromJSON = useCallback(
    async (
      file: File,
    ): Promise<{ success: boolean; count: number; errors: string[] }> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        const errors: string[] = [];

        reader.onload = async (event) => {
          try {
            const content = event.target?.result as string;
            const notes: INote[] = JSON.parse(content);

            let importedCount = 0;

            // Проверяем структуру данных
            if (!Array.isArray(notes)) {
              throw new Error('Invalid file format: expected array of notes');
            }

            // Импортируем каждую заметку
            for (const note of notes) {
              try {
                // Проверяем обязательные поля
                if (!note.id || !note.title || !note.content) {
                  errors.push(
                    `Note missing required fields: ${note.id || 'unknown'}`,
                  );
                  continue;
                }

                // Конвертируем строки дат в объекты Date
                const noteToImport: INote = {
                  ...note,
                  createdAt: note.createdAt
                    ? new Date(note.createdAt)
                    : new Date(),
                  updatedAt: note.updatedAt
                    ? new Date(note.updatedAt)
                    : new Date(),
                };

                // Добавляем заметку
                await addNote(noteToImport);
                importedCount++;
              } catch (noteError) {
                errors.push(`Error importing note ${note.id}: ${noteError}`);
              }
            }

            resolve({
              success: importedCount > 0,
              count: importedCount,
              errors,
            });
          } catch (error) {
            console.error('Import error:', error);
            resolve({
              success: false,
              count: 0,
              errors: [`Failed to parse file: ${error}`],
            });
          }
        };

        reader.onerror = () => {
          resolve({
            success: false,
            count: 0,
            errors: ['Failed to read file'],
          });
        };

        reader.readAsText(file);
      });
    },
    [addNote],
  );

  /** Очистить все заметки */
  const clearAllNotes = useCallback(async () => {
    try {
      const notes = await getAllNotes();
      const deletePromises = notes.map((note) => deleteNote(note.id));
      await Promise.all(deletePromises);
      return { success: true, count: notes.length };
    } catch (error) {
      console.error('Clear error:', error);
      return { success: false, error };
    }
  }, [getAllNotes, deleteNote]);

  return {
    exportToJSON,
    importFromJSON,
    clearAllNotes,
  };
};
