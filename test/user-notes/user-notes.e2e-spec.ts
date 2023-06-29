import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { IBlobStorage } from 'src/shared/blob-storage/interfaces/IBlobStorage';
import { UsersService } from 'src/modules/users/users.service';
import { NotesService } from 'src/modules/notes/notes.service';
import { UserNotesService } from 'src/modules/user-notes/user-notes.service';
import { BlobStorage } from 'src/shared/blob-storage/blob-storage.storage';
import { UserNotesController } from 'src/modules/user-notes/user-notes.controller';
import { Note } from 'src/modules/notes/note.entity';
import { User } from 'src/modules/users/user.entity';

describe('UserNotes', () => {
  let app: INestApplication;
  let storage: BlobStorage;
  let usersService: UsersService;
  let notesService: NotesService;

  let mockUser: User;
  let mockNote: Note;
  let mockUserNotes: string[];

  const mockUserNotesStorage: jest.Mocked<IBlobStorage> = {
    putFile: jest.fn(),
    containsFileWithNoteId: jest.fn(),
    findByUser: jest.fn(),
  };

  const mockUsersService: jest.Mocked<Partial<UsersService>> = {
    get: jest.fn(),
  };

  const mockNotesService: jest.Mocked<Partial<NotesService>> = {
    get: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        UserNotesService,
        { provide: BlobStorage, useValue: mockUserNotesStorage },
        { provide: NotesService, useValue: mockNotesService },
        { provide: UsersService, useValue: mockUsersService },
      ],
      controllers: [UserNotesController],
    }).compile();

    app = moduleFixture.createNestApplication();
    storage = moduleFixture.get<BlobStorage>(BlobStorage);
    usersService = moduleFixture.get<UsersService>(UsersService);
    notesService = moduleFixture.get<NotesService>(NotesService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    jest.restoreAllMocks();

    mockNote = {
      id: '617789d8d62c4f0016e52418',
      title: 'title 1',
      description: 'description 1',
    } as Note;

    mockUser = {
      id: 1,
      name: 'Test User 1',
      email: 'test1@example.com',
      password: 'testpassword1',
    } as User;

    mockUserNotes = [
      '1_617789d8d62c4f0016e52418',
      '1_615c6a81cbedb8c1a147c3ae',
    ];
  });

  it('should get notes by user id', async () => {
    jest.spyOn(usersService, 'get').mockResolvedValueOnce(mockUser);
    jest.spyOn(storage, 'findByUser').mockResolvedValueOnce(mockUserNotes);

    const response = await request(app.getHttpServer())
      .get(`/user/${mockUser.id}/notes`)
      .expect(200);

    expect(response.body).toEqual(mockUserNotes);
  });

  it('should create a user-note', async () => {
    jest.spyOn(notesService, 'get').mockResolvedValueOnce(mockNote);
    jest.spyOn(usersService, 'get').mockResolvedValueOnce(mockUser);

    const { body: createdUserNote } = await request(app.getHttpServer())
      .post(`/user/${mockUser.id}/notes/${mockNote.id}`)
      .expect(201);

    const expected = {
      userId: mockUser.id.toString(),
      noteId: mockNote.id,
    };

    expect(createdUserNote).toEqual(expected);
    expect(storage.putFile).toHaveBeenCalledWith(
      `${mockUser.id}_${mockNote.id}`,
    );
  });
});
