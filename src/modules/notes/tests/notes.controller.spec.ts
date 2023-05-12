import { Test } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { NotesController } from '../notes.controller';
import { CreateNoteDto, UpdateNoteDto } from '../dtos';
import { Note } from '../note.entity';
import { NotesService } from '../notes.service';

describe('NotessController', () => {
  let notesController: NotesController;
  let notesService: NotesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: {
            getAll: jest.fn(),
            get: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    notesService = module.get<NotesService>(NotesService);
    notesController = module.get<NotesController>(NotesController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockNote = {
    id: '615c6a81cbedb8c1a147c3ae',
    title: 'Note 1',
    description: 'Some text...',
  } as Note;

  describe('Method create', () => {
    it('should create a new note with the given data', async () => {
      const noteToCreate: CreateNoteDto = {
        title: 'Note 1',
        description: 'Some text...',
      };

      jest.spyOn(notesService, 'create').mockResolvedValueOnce(mockNote);

      const actual = await notesController.create(noteToCreate);

      expect(notesService.create).toHaveBeenCalledWith(noteToCreate);
      expect(actual).toEqual(mockNote);
    });

    it('should throw an error if a note with the same email already exists', async () => {
      const noteToCreate: CreateNoteDto = {
        title: 'Note 1',
        description: 'Some text...',
      };

      const mockError = new ConflictException(
        `Note with the title "${noteToCreate.title}" already exists!`,
      );

      jest.spyOn(notesService, 'create').mockRejectedValueOnce(mockError);

      await expect(notesController.create(noteToCreate)).rejects.toThrow(
        mockError,
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

      jest.spyOn(notesService, 'getAll').mockResolvedValueOnce(mockNotes);

      const actual = await notesController.getAll();

      expect(notesService.getAll).toHaveBeenCalled();
      expect(actual).toBe(mockNotes);
    });
  });

  describe('Method get', () => {
    it('should return a note with the given id', async () => {
      const mockId = '615c6a81cbedb8c1a147c3ae';

      jest.spyOn(notesService, 'get').mockResolvedValueOnce(mockNote);

      const actual = await notesController.get(mockId);

      expect(notesService.get).toHaveBeenCalledWith(mockId);
      expect(actual).toBe(mockNote);
    });
  });

  describe('Method update', () => {
    it('should update an existing note', async () => {
      const mockId = '615c6a81cbedb8c1a147c3ae';

      const noteToUpdate: Partial<Note> = {
        title: 'Updated Test Note',
      };

      jest.spyOn(notesService, 'update').mockResolvedValueOnce(mockNote);

      const actual = await notesController.update(mockId, noteToUpdate);

      expect(notesService.update).toHaveBeenCalledWith(mockId, noteToUpdate);
      expect(actual).toBe(mockNote);
    });
  });

  describe('Method delete', () => {
    it('should delete a note with the given id', async () => {
      const mockId = '615c6a81cbedb8c1a147c3ae';

      await notesController.delete(mockId);

      expect(notesService.delete).toHaveBeenCalledWith(mockId);
    });
  });
});
