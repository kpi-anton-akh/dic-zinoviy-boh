import { UserNote } from '../user-note.entity';

export interface IUserNotesService {
  getNotes: (userId: number) => Promise<string[]>;
  createUserNote: (userId: number, noteId: string) => Promise<UserNote>;
}
