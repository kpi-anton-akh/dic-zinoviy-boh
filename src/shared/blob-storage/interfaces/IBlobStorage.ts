export interface IBlobStorage {
  putFile(filename: string): Promise<void>;
  containsFileWithNoteId(noteId: string): Promise<boolean>;
  findByUser(userId: number): Promise<string[]>;
}
