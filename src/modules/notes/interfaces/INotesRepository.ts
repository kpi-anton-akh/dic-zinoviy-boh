import { Note } from '../note.entity';

export interface INotesRepository {
  getAll(): Promise<Note[]>;
  get(id: string): Promise<Note>;
  create(note: Partial<Note>): Promise<Note>;
  update(id: string, note: Partial<Note>): Promise<Note>;
  delete(id: string): Promise<void>;
  getByTitle(name: string): Promise<Note>;
}
