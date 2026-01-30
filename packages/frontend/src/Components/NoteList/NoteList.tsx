import React from 'react';

import type { INote } from '@/Types/Note.ts';

interface NoteListProps {
  notes: INote[];
  selectedNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
}) => {
  const handleDelete = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    if (window.confirm('Удалить заметку?')) {
      onDeleteNote(noteId);
    }
  };

  return (
    <div className='note-list'>
      <div className='note-list-header'>
        <h2>Мои заметки</h2>
        <div className='note-count'>{notes.length} заметок</div>
      </div>

      <div className='notes-container'>
        {notes.length === 0 ? (
          <div className='empty-state'>
            <p>Нет заметок</p>
            <small>Создайте первую заметку</small>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`note-item ${selectedNoteId === note.id ? 'selected' : ''}`}
              onClick={() => onSelectNote(note.id)}>
              <div className='note-item-content'>
                <h3 className='note-title'>{note.title || 'Без названия'}</h3>
                <p className='note-preview'>
                  {note.content.substring(0, 50)}
                  {note.content.length > 50 ? '...' : ''}
                </p>
                <div className='note-meta'>
                  <span className='note-date'>
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                className='delete-btn'
                onClick={(e) => handleDelete(e, note.id)}
                title='Удалить'>
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
