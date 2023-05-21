import { Test } from '@nestjs/testing';
import { UserNotesController } from '../user-notes.controller';
import { UserNotesService } from '../user-notes.service';
import { IUserNotesService } from '../interfaces/IUserNotesService';
import { Note } from 'src/modules/notes/note.entity';
import { User } from 'src/modules/users/user.entity';
import { UserNote } from '../user-note.entity';

describe('UserNotesController', () => {
  let userNotesController: UserNotesController;
  let userNotesService: UserNotesService;

  let mockUser: User;
  let mockNote: Note;
  let mockUserNotes: string[];

  const mockUserNotesService: jest.Mocked<IUserNotesService> = {
    createUserNote: jest.fn(),
    getNotes: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [UserNotesController],
      providers: [
        {
          provide: UserNotesService,
          useValue: mockUserNotesService,
        },
      ],
    }).compile();

    userNotesService = moduleFixture.get<UserNotesService>(UserNotesService);
    userNotesController =
      moduleFixture.get<UserNotesController>(UserNotesController);
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

  describe('getNotesByUserId', () => {
    it('should return notes by user id', async () => {
      jest
        .spyOn(userNotesService, 'getNotes')
        .mockResolvedValueOnce(mockUserNotes);

      const actual = await userNotesController.getNotesByUserId(mockUser.id);

      expect(actual).toEqual(mockUserNotes);
      expect(userNotesService.getNotes).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('createUserNote', () => {
    it('should create user note', async () => {
      const mockUserNote: UserNote = {
        userId: mockUser.id,
        noteId: mockNote.id,
      };

      jest.spyOn(userNotesService, 'createUserNote').mockResolvedValueOnce({
        userId: mockUser.id,
        noteId: mockNote.id,
      });

      const actual = await userNotesController.createUserNote(
        mockUser.id,
        mockNote.id,
      );

      expect(userNotesService.createUserNote).toHaveBeenCalledWith(
        mockUser.id,
        mockNote.id,
      );
      expect(actual).toEqual(mockUserNote);
    });
  });
});
