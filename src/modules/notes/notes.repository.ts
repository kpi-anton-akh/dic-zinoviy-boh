import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { INotesRepository } from './interfaces/index';
import { Note } from './note.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { ObjectID } from 'mongodb';
import { MONGO_CONNECTION_NAME } from '../../shared/constants/index';

@Injectable()
export class NotesRepository implements INotesRepository {
  constructor(
    @InjectRepository(Note, MONGO_CONNECTION_NAME)
    private notesRepository: Repository<Note>,
  ) {}

  async get(id: string): Promise<Note> {
    const noteFromDB = await this.notesRepository.findOneBy(new ObjectID(id));
    const note = plainToClass(Note, noteFromDB);

    return note;
  }

  async getAll(): Promise<Note[]> {
    const notesFromDB = await this.notesRepository.find();
    const notes = notesFromDB.map((note) => plainToClass(Note, note));

    return notes;
  }

  async create(noteToCreate: Partial<Note>): Promise<Note> {
    const noteFromDB = this.notesRepository.create(noteToCreate);
    const savedNote = await this.notesRepository.save(noteFromDB);
    const createdNote = plainToClass(Note, savedNote);

    return createdNote;
  }

  async update(id: string, noteToUpdate: Partial<Note>): Promise<Note> {
    await this.notesRepository.update(id, noteToUpdate);
    const noteFromDB = await this.notesRepository.findOneBy(new ObjectID(id));
    const updatedNote = plainToClass(Note, noteFromDB);

    return updatedNote;
  }

  async delete(id: string): Promise<void> {
    await this.notesRepository.delete(new ObjectID(id));
  }

  async getByTitle(title: string): Promise<Note> {
    const noteFromDB = await this.notesRepository.findOneBy({ title });
    const note = plainToClass(Note, noteFromDB);

    return note;
  }
}
