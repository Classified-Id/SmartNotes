import React, { useState } from 'react';

import type { ICreateNoteButtonProps } from './CreateNoteButton.props.ts';

export const CreateNoteButton: React.FC<ICreateNoteButtonProps> = ({
  onCreate,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleCreate = () => {
    if (!isCreating) {
      setIsCreating(true);
    } else if (newTitle.trim()) {
      onCreate(newTitle.trim());
      setNewTitle('');
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setNewTitle('');
    setIsCreating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTitle.trim()) {
      handleCreate();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className='create-note-container'>
      {isCreating ? (
        <div className='create-note-input'>
          <input
            type='text'
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Введите название заметки'
            autoFocus
          />
          <div className='create-note-actions'>
            <button onClick={handleCreate} disabled={!newTitle.trim()}>
              Создать
            </button>
            <button onClick={handleCancel} className='cancel-btn'>
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <button className='create-note-btn' onClick={() => setIsCreating(true)}>
          <span className='plus-icon'>+</span>
          Новая заметка
        </button>
      )}
    </div>
  );
};
