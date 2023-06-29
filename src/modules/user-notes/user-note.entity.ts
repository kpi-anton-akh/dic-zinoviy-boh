export class UserNote {
  userId: number;
  noteId: string;

  constructor(userId: number, noteId: string) {
    this.userId = userId;
    this.noteId = noteId;
  }
}
