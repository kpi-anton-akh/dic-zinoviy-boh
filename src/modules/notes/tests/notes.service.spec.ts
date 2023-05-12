import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { NotesService } from '../notes.service';
import { NotesRepository } from '../notes.repository';
import { Note } from '../note.entity';

describe('UsersService', () => {
  let notesService: NotesService;
  let notesRepository: NotesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: NotesRepository,
          useValue: {
            get: jest.fn(),
            getAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getByTitle: jest.fn(),
          },
        },
      ],
    }).compile();

    notesService = module.get<NotesService>(NotesService);
    notesRepository = module.get<NotesRepository>(NotesRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockNote: Note = {
    id: '615c6a81cbedb8c1a147c3ae',
    title: 'Note 1',
    description: 'Some text...',
  };

  describe('Method create', () => {
    it('should create a new note with the given data', async () => {
      const noteToCreate: Partial<Note> = {
        title: 'Note 1',
        description: 'Some text...',
      };

      jest.spyOn(notesRepository, 'getByTitle').mockResolvedValue(null);
      jest.spyOn(notesRepository, 'create').mockResolvedValue(mockNote);

      const actual = await notesService.create(noteToCreate);

      expect(notesRepository.getByTitle).toHaveBeenCalledWith(
        noteToCreate.title,
      );
      expect(notesRepository.create).toHaveBeenCalledWith(noteToCreate);
      expect(actual).toEqual(mockNote);
    });

    it('should throw an error if a note with the same title already exists', async () => {
      const noteToCreate: Partial<Note> = {
        title: 'Note 1',
        description: 'Some text...',
      };

      jest.spyOn(notesRepository, 'getByTitle').mockResolvedValue(mockNote);

      await expect(notesService.create(noteToCreate)).rejects.toThrow(
        new ConflictException(
          `Note with the title "${noteToCreate.title}" already exists!`,
        ),
      );
    });
  });

  describe('Method getAll', () => {
    it('should return an array of notes', async () => {
      const mockNotes: Note[] = [
        {
          id: '615c6a81cbedb8c1a147c3ae',
          title: 'Note 1',
          description: 'Some text...',
        },
        {
          id: '617789d8d62c4f0016e52418',
          title: 'Note 2',
          description: 'Some text...',
        },
      ];

      jest.spyOn(notesRepository, 'getAll').mockResolvedValue(mockNotes);

      const actual = await notesService.getAll();

      expect(notesRepository.getAll).toHaveBeenCalled();
      expect(actual).toEqual(mockNotes);
    });
  });

  describe('Method get', () => {
    it('should return a note with the given id', async () => {
      const mockId = '615c6a81cbedb8c1a147c3ae';

      jest.spyOn(notesRepository, 'get').mockResolvedValue(mockNote);

      const actual = await notesService.get(mockId);

      expect(notesRepository.get).toHaveBeenCalledWith(mockId);
      expect(actual).toEqual(mockNote);
    });
  });

  describe('Method update', () => {
    it('should update an existing note', async () => {
      const mockId = '615c6a81cbedb8c1a147c3ae';

      const noteToUpdate: Partial<Note> = {
        title: 'Updated Test Note',
      };

      jest.spyOn(notesRepository, 'update').mockResolvedValue({
        ...mockNote,
        ...noteToUpdate,
      });

      const actual = await notesService.update(mockId, noteToUpdate);

      expect(notesRepository.update).toHaveBeenCalledWith(mockId, noteToUpdate);
      expect(actual).toEqual({
        ...mockNote,
        ...noteToUpdate,
      });
    });
  });

  describe('Method delete', () => {
    it('should delete a note with the given id', async () => {
      const mockId = '615c6a81cbedb8c1a147c3ae';

      await notesService.delete(mockId);

      expect(notesRepository.delete).toHaveBeenCalledWith(mockId);
    });
  });
});
