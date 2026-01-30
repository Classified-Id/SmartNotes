import './App.css';

import { useEffect, useState } from 'react';

import { CreateNoteButton, NoteList } from '@/Components';
import { NoteEditor } from '@/Widgets';

import { useIndexedDB } from '@/Hooks';

import type { INote } from '@/Types/Note.ts';
import './App.css';

function App() {
  const { isInitialized, addNote, getAllNotes, updateNote, deleteNote } =
    useIndexedDB();

  const [notes, setNotes] = useState<INote[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** Загружаем заметки при инициализации */
  useEffect(() => {
    if (isInitialized) {
      loadNotes();
    }
  }, [isInitialized]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const loadedNotes = await getAllNotes();
      setNotes(loadedNotes);

      /** Автоматически выбираем первую заметку, если есть */
      if (loadedNotes.length > 0 && !selectedNoteId) {
        setSelectedNoteId(loadedNotes[0].id);
      }
    } catch (err) {
      setError('Ошибка загрузки заметок');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (title: string) => {
    try {
      const noteId = await addNote({
        title: title || 'Новая заметка',
        content: '',
      });

      /** Перезагружаем список заметок */
      await loadNotes();

      /** Выбираем созданную заметку */
      setSelectedNoteId(noteId);
    } catch (err) {
      console.error('Error creating note:', err);
      alert('Ошибка при создании заметки');
    }
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  const handleSaveNote = async (id: string, title: string, content: string) => {
    try {
      await updateNote(id, { title, content });

      /** Обновляем локальное состояние */
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === id
            ? { ...note, title, content, updatedAt: new Date() }
            : note,
        ),
      );
    } catch (err) {
      console.error('Error saving note:', err);
      throw err;
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);

      /** Обновляем локальное состояние */
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));

      /** Если удалили выбранную заметку, выбираем другую или сбрасываем выбор */
      if (selectedNoteId === noteId) {
        const remainingNotes = notes.filter((note) => note.id !== noteId);
        setSelectedNoteId(
          remainingNotes.length > 0 ? remainingNotes[0].id : null,
        );
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Ошибка при удалении заметки');
    }
  };

  const selectedNote = notes.find((note) => note.id === selectedNoteId) || null;

  if (!isInitialized || loading) {
    return (
      <div className='app-loading'>
        <div className='spinner'></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='app-error'>
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button onClick={loadNotes}>Повторить</button>
      </div>
    );
  }

  return (
    <div className='app'>
      <header className='app-header'>
        <h1>📝 Smart Notes</h1>
        <div className='app-controls'>
          <CreateNoteButton onCreate={handleCreateNote} />
        </div>
      </header>

      <main className='app-main'>
        <aside className='app-sidebar'>
          <NoteList
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelectNote={handleSelectNote}
            onDeleteNote={handleDeleteNote}
          />
        </aside>

        <section className='app-content'>
          <NoteEditor note={selectedNote} onSave={handleSaveNote} />
        </section>
      </main>

      <footer className='app-footer'>
        <p>Все заметки хранятся локально в вашем браузере</p>
      </footer>
    </div>
  );
}

export default App;
