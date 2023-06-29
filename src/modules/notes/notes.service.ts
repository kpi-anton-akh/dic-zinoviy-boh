import { ConflictException, Injectable } from '@nestjs/common';
import { Note } from './note.entity';
import { NotesRepository } from './notes.repository';

@Injectable()
export class NotesService {
  constructor(private notesRepository: NotesRepository) {}

  async getAll(): Promise<Note[]> {
    return this.notesRepository.getAll();
  }

  async get(id: string): Promise<Note> {
    return this.notesRepository.get(id);
  }

  async create(note: Partial<Note>): Promise<Note> {
    const noteInDB = await this.notesRepository.getByTitle(note.title);

    if (noteInDB)
      throw new ConflictException(
        `Note with the title "${note.title}" already exists!`,
      );

    return this.notesRepository.create(note);
  }

  async update(id: string, note: Partial<Note>): Promise<Note> {
    return this.notesRepository.update(id, note);
  }

  async delete(id: string): Promise<void> {
    await this.notesRepository.delete(id);
  }
}
