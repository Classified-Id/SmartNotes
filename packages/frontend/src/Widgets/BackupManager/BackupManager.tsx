import React, { useRef, useState } from 'react';

import { useNotesExport } from '@/Hooks';

import './BackupManager.css';

export const BackupManager: React.FC = () => {
  const { exportToJSON, importFromJSON, clearAllNotes } =
    useNotesExport();
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    count: number;
    errors: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = async () => {
    const result = await exportToJSON();
    if (result.success) {
      alert(`Экспортировано ${result.count} заметок`);
    } else {
      alert('Ошибка экспорта');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const result = await importFromJSON(file);
      setImportResult(result);

      if (result.success) {
        alert(`Импортировано ${result.count} заметок`);
      } else {
        alert('Ошибка импорта');
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Ошибка при импорте файла');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Вы уверены? Все заметки будут удалены безвозвратно.')) {
      const result = await clearAllNotes();
      if (result.success) {
        alert(`Удалено ${result.count} заметок`);
        window.location.reload(); // Перезагружаем для обновления списка
      } else {
        alert('Ошибка при очистке');
      }
    }
  };

  return (
    <div className='backup-manager'>
      <h3>Резервное копирование</h3>

      <div className='backup-actions'>
        <button onClick={handleExportJSON} className='btn btn-primary'>
          📥 Экспорт
        </button>

        <button
          onClick={handleImportClick}
          className='btn btn-success'
          disabled={isImporting}>
          {isImporting ? 'Импорт...' : '📤 Импорт'}
        </button>

        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept='.json,application/json'
          style={{ display: 'none' }}
        />

        <button onClick={handleClearAll} className='btn btn-danger'>
          🗑️ Очистить
        </button>
      </div>

      {importResult && importResult.errors.length > 0 && (
        <div className='import-errors'>
          <h4>Ошибки при импорте:</h4>
          <ul>
            {importResult.errors.slice(0, 5).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
          {importResult.errors.length > 5 && (
            <p>... и еще {importResult.errors.length - 5} ошибок</p>
          )}
        </div>
      )}

      <div className='backup-info'>
        <p>
          <small>• JSON файл можно редактировать вручную</small>
        </p>
        <p>
          <small>• Все данные хранятся только в вашем браузере</small>
        </p>
        <p>
          <small>• Регулярно делайте бэкапы!</small>
        </p>
      </div>
    </div>
  );
};
