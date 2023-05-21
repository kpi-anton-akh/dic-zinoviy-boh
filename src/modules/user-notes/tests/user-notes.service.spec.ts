import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserNotesService } from '../user-notes.service';
import { UserNotesStorage } from '../user-note.storage';
import { Note } from 'src/modules/notes/note.entity';
import { User } from 'src/modules/users/user.entity';
import { NotesService } from '../../notes/notes.service';
import { UsersService } from '../../users/users.service';

describe('UserNotesService', () => {
  let storage: UserNotesStorage;
  let usersService: UsersService;
  let notesService: NotesService;
  let userNotesService: UserNotesService;

  let mockUser: User;
  let mockNote: Note;
  let mockUserNotes: string[];

  const mockUserNotesStorage: jest.Mocked<Partial<UserNotesStorage>> = {
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
        { provide: UserNotesStorage, useValue: mockUserNotesStorage },
        { provide: NotesService, useValue: mockNotesService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    userNotesService = moduleFixture.get<UserNotesService>(UserNotesService);
    storage = moduleFixture.get<UserNotesStorage>(UserNotesStorage);
    usersService = moduleFixture.get<UsersService>(UsersService);
    notesService = moduleFixture.get<NotesService>(NotesService);
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

  describe('getIngredients', () => {
    it('should return notes by user id', async () => {
      jest.spyOn(usersService, 'get').mockResolvedValueOnce(mockUser);
      jest.spyOn(storage, 'findByUser').mockResolvedValueOnce(mockUserNotes);

      const actual = await userNotesService.getNotes(mockUser.id);

      expect(storage.findByUser).toHaveBeenCalledWith(mockUser.id);
      expect(actual).toEqual(mockUserNotes);
    });

    it('should throw an error if user with given id does not exist', async () => {
      jest
        .spyOn(usersService, 'get')
        .mockRejectedValueOnce(new ConflictException());

      const notExistedUserId = 2;

      try {
        await userNotesService.getNotes(notExistedUserId);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
    });
  });

  describe('createUserNote', () => {
    it('should create user note', async () => {
      jest.spyOn(usersService, 'get').mockResolvedValueOnce(mockUser);
      jest.spyOn(notesService, 'get').mockResolvedValueOnce(mockNote);
      jest
        .spyOn(storage, 'containsFileWithNoteId')
        .mockResolvedValueOnce(false);

      const actual = await userNotesService.createUserNote(
        mockUser.id,
        mockNote.id,
      );

      const expected = {
        userId: mockUser.id,
        noteId: mockNote.id,
      };

      expect(storage.putFile).toHaveBeenCalledWith(
        `${mockUser.id}_${mockNote.id}`,
      );
      expect(actual).toEqual(expected);
    });

    it("should throw an error if user with given id doesn't exist", async () => {
      jest
        .spyOn(usersService, 'get')
        .mockRejectedValueOnce(new ConflictException());

      try {
        await userNotesService.createUserNote(mockUser.id, mockNote.id);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
    });

    it("should throw an error if note with given id doesn't exist", async () => {
      jest.spyOn(usersService, 'get').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(notesService, 'get')
        .mockRejectedValueOnce(new ConflictException());

      try {
        await userNotesService.createUserNote(mockUser.id, mockNote.id);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
    });

    it('should throw an error if relation with given noteId already exists', async () => {
      jest.spyOn(usersService, 'get').mockResolvedValueOnce(mockUser);
      jest.spyOn(notesService, 'get').mockResolvedValueOnce(mockNote);
      jest.spyOn(storage, 'containsFileWithNoteId').mockResolvedValueOnce(true);

      try {
        await userNotesService.createUserNote(mockUser.id, mockNote.id);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
    });
  });
});
