import { INote } from '../../Types/Note.ts';

export interface NoteEditorProps {
  note: INote | null;
  onSave: (id: string, title: string, content: string) => void;
}
