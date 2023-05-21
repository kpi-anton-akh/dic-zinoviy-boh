import { UserNote } from '../user-note.entity';

export interface IRecipeIngredientsService {
  getNotes: (userId: number) => Promise<string[]>;
  createUserNote: (userId: number, noteId: string) => Promise<UserNote>;
}
