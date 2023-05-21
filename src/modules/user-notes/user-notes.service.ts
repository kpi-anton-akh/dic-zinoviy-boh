import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { NotesService } from '../notes/notes.service';
import { UserNotesStorage } from './user-note.storage';
import { UserNote } from './user-note.entity';

@Injectable()
export class UserNotesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly notesService: NotesService,
    private readonly userNotesStorage: UserNotesStorage,
  ) {}

  async getNotes(userId: number): Promise<string[]> {
    const user = await this.usersService.get(userId);
    const notesIds = await this.userNotesStorage.findByUser(user.id);

    return notesIds;
  }

  async createUserNote(userId: number, noteId: string): Promise<UserNote> {
    const user = await this.usersService.get(userId);
    const note = await this.notesService.get(noteId);

    const isNoteAssigned = await this.userNotesStorage.containsFileWithNoteId(
      noteId,
    );

    if (isNoteAssigned) {
      throw new ConflictException(
        'This Note is already assigned to some user!',
      );
    }

    const relationFileName = `${user.id}_${note.id}`;

    await this.userNotesStorage.putFile(relationFileName);

    return new UserNote(userId, noteId);
  }
}
