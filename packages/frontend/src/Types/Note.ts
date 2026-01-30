export interface INote {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NewNote = Omit<INote, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
};
