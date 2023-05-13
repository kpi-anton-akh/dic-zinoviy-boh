import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { NotesController } from 'src/modules/notes/notes.controller';
import { NotesService } from 'src/modules/notes/notes.service';
import { Note } from 'src/modules/notes/note.entity';
import { CreateNoteDto, UpdateNoteDto } from 'src/modules/notes/dtos';
import { NotesRepository } from 'src/modules/notes/notes.repository';
import { INotesRepository } from 'src/modules/notes/interfaces';

class NotesRepositoryMock implements INotesRepository {
  private notes: Note[];

  async getAll(): Promise<Note[]> {
    return this.notes;
  }

  async get(id: string): Promise<Note> {
    const note = this.notes.find((note) => note.id === id);

    return note ? note : null;
  }

  async create(note: Partial<Note>): Promise<Note> {
    const noteToCreate: Note = {
      id: '617789d8d62c4f0016e52418',
      title: note.title,
      description: note.description,
    };

    this.notes.push(noteToCreate);

    return noteToCreate;
  }

  async update(id: string, updateNoteDto: Partial<Note>): Promise<Note> {
    const note = await this.get(id);
    if (note) {
      Object.assign(note, updateNoteDto);
    }

    return note;
  }

  async delete(id: string): Promise<void> {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex !== -1) {
      this.notes.splice(noteIndex, 1);
    }
  }

  async getByTitle(title: string): Promise<Note> {
    const note = this.notes.find((note) => note.title === title);

    return note ? note : null;
  }
}

describe('Notes', () => {
  let app;
  let notesRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        NotesService,
        {
          provide: NotesRepository,
          useClass: NotesRepositoryMock,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    notesRepository = module.get<NotesRepository>(NotesRepository);
  });

  beforeEach(() => {
    notesRepository.notes = [
      {
        id: '615c6a81cbedb8c1a147c3ae',
        title: 'Some text',
        description: 'Some description',
      },
    ];
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a note', async () => {
    const newNote: CreateNoteDto = {
      title: 'Note 2',
      description: 'Some text...',
    };

    const expectedCreatedNote: Note = {
      id: '617789d8d62c4f0016e52418',
      title: 'Note 2',
      description: 'Some text...',
    };

    const response = await request(app.getHttpServer())
      .post('/notes')
      .send(newNote)
      .expect(201);

    const createdNote = await notesRepository.get(response.body.id);

    const notesAfterCreate = await notesRepository.getAll();

    expect(createdNote).toMatchObject(expectedCreatedNote);
    expect(typeof createdNote.id).toBe('string');
    expect(notesAfterCreate.length).toBe(2);
  });

  it('should get all notes', async () => {
    const response = await request(app.getHttpServer())
      .get('/notes')
      .expect(200);

    const expectedNotes = await notesRepository.getAll();

    expect(response.body).toEqual(expect.arrayContaining(expectedNotes));
  });

  it('should get a note by id', async () => {
    const noteId = '615c6a81cbedb8c1a147c3ae';
    const response = await request(app.getHttpServer())
      .get(`/notes/${noteId}`)
      .expect(200);

    const expectedNote = await notesRepository.get(noteId);

    expect(response.body).toEqual(expectedNote);
    expect(typeof response.body.id).toBe('string');
  });

  it('should update a note', async () => {
    const noteId = '615c6a81cbedb8c1a147c3ae';
    const updatedNote: UpdateNoteDto = {
      title: 'Updated Test note',
    };

    await request(app.getHttpServer())
      .put(`/notes/${noteId}`)
      .send(updatedNote)
      .expect(200);

    const note = await notesRepository.get(noteId);

    expect(note.title).toBe(updatedNote.title);
    expect(note.id).toBe(noteId);
  });

  it('should delete a note', async () => {
    const noteId = '615c6a81cbedb8c1a147c3ae';

    await request(app.getHttpServer()).delete(`/notes/${noteId}`).expect(200);

    const deletedNote = await notesRepository.get(noteId);

    const notesAfterDelete = await notesRepository.getAll();

    expect(deletedNote).toBeNull();
    expect(notesAfterDelete.length).toBe(0);
  });
});
