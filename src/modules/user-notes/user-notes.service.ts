import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { NotesService } from '../notes/notes.service';
import { BlobStorage } from './BlobStorage';
import { UserNote } from './user-note.entity';

@Injectable()
export class UserNotesService {
  blobStorage: BlobStorage;

  constructor(
    private readonly usersService: UsersService,
    private readonly notesService: NotesService,
  ) {
    // inject it istead of internal assignment - maybe make it as module
    this.blobStorage = new BlobStorage({
      containerName: 'user-notes',
      accountName: 'dicbohphase3',
      sasToken:
        '?sp=racwdli&st=2023-05-20T19:44:50Z&se=2023-05-21T03:44:50Z&spr=https&sv=2022-11-02&sr=c&sig=L8j55qFfCZzAykNikxjA2evDU64LSN%2F11zL5BBbBGTA%3D',
    });
  }

  async getNotes(userId: number): Promise<string[]> {
    const user = await this.usersService.get(userId);
    const notesIds = await this.blobStorage.findByUser(user.id);

    return notesIds;
  }

  async createUserNote(userId: number, noteId: string): Promise<UserNote> {
    const user = await this.usersService.get(userId);
    const note = await this.notesService.get(noteId);

    const isNoteAssigned = await this.blobStorage.containsFileWithNoteId(
      noteId,
    );

    if (isNoteAssigned) {
      throw new ConflictException(
        'This Note is already assigned to some user!',
      );
    }

    const relationFileName = `${user.id}_${note.id}`;

    await this.blobStorage.putFile(relationFileName);

    return new UserNote(userId, noteId);
  }
}
