import React, { useCallback, useEffect, useState } from 'react';

import type { NoteEditorProps } from './NoteEditor.props.ts';

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  /** Обновляем форму при выборе новой заметки */
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSave = useCallback(async () => {
    if (!note || (!title.trim() && !content.trim())) return;

    setIsSaving(true);
    try {
      await onSave(note.id, title.trim(), content.trim());
      setLastSaved(new Date());

      /** Показываем сообщение об успешном сохранении на 2 секунды */
      setTimeout(() => {
        setLastSaved(null);
      }, 2000);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Ошибка при сохранении заметки');
    } finally {
      setIsSaving(false);
    }
  }, [note, title, content, onSave]);

  /** Автосохранение при изменении (с задержкой) */
  useEffect(() => {
    if (!note) return;

    const timer = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        handleSave();
      }
    }, 1500); // Сохраняем через 1.5 секунды после последнего изменения

    return () => clearTimeout(timer);
  }, [title, content, note, handleSave]);

  if (!note) {
    return (
      <div className='note-editor empty'>
        <div className='empty-state'>
          <h3>Выберите заметку</h3>
          <p>или создайте новую</p>
        </div>
      </div>
    );
  }

  return (
    <div className='note-editor'>
      <div className='editor-header'>
        <input
          type='text'
          className='note-title-input'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Название заметки'
        />

        <div className='editor-actions'>
          {lastSaved && (
            <span className='save-indicator'>
              Сохранено{' '}
              {lastSaved.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
          {isSaving && <span className='saving-indicator'>Сохранение...</span>}
        </div>
      </div>

      <div className='editor-content'>
        <textarea
          className='note-content-textarea'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Начните писать здесь...'
          rows={20}
        />
      </div>

      <div className='editor-footer'>
        <div className='note-info'>
          <span>Создано: {new Date(note.createdAt).toLocaleDateString()}</span>
          <span>Изменено: {new Date(note.updatedAt).toLocaleDateString()}</span>
        </div>
        <button
          className='save-btn'
          onClick={handleSave}
          disabled={isSaving || (!title.trim() && !content.trim())}>
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
};
