import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotesRepository } from '../notes.repository';
import { Note } from '../note.entity';
import { ObjectID } from 'mongodb';
import { MONGO_CONNECTION_NAME } from '../../../shared/constants/index';

describe('NotesRepository', () => {
  let notesRepository: NotesRepository;
  let noteRepository: Repository<Note>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesRepository,
        {
          provide: getRepositoryToken(Note, MONGO_CONNECTION_NAME),
          useValue: {
            get: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    notesRepository = module.get<NotesRepository>(NotesRepository);
    noteRepository = module.get<Repository<Note>>(
      getRepositoryToken(Note, MONGO_CONNECTION_NAME),
    );
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
      const noteToCreate = {
        title: 'Note 1',
        description: 'Some text...',
      } as Partial<Note>;

      const savedNote = {
        ...mockNote,
        ...noteToCreate,
      } as Note;

      jest.spyOn(noteRepository, 'create').mockReturnValueOnce(mockNote);
      jest.spyOn(noteRepository, 'save').mockResolvedValueOnce(savedNote);

      const actual = await notesRepository.create(noteToCreate);

      expect(actual).toEqual(savedNote);
      expect(noteRepository.create).toHaveBeenCalledWith(noteToCreate);
      expect(noteRepository.save).toHaveBeenCalledWith(mockNote);
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

      jest.spyOn(noteRepository, 'find').mockResolvedValueOnce(mockNotes);

      const actual = await notesRepository.getAll();

      expect(actual).toEqual(mockNotes);
      expect(noteRepository.find).toHaveBeenCalled();
    });
  });

  describe('Method get', () => {
    it('should return a note with the given id', async () => {
      const mockId = new ObjectID('615c6a81cbedb8c1a147c3ae');

      jest.spyOn(noteRepository, 'findOneBy').mockResolvedValueOnce(mockNote);

      const actual = await notesRepository.get(mockId);

      expect(actual).toEqual(mockNote);
      expect(noteRepository.findOneBy).toHaveBeenCalledWith(mockId);
    });
  });

  describe('Method update', () => {
    it('should update an existing note', async () => {
      const mockId = new ObjectID('615c6a81cbedb8c1a147c3ae');
      const noteToUpdate = { name: 'Updated User 1' } as Partial<Note>;

      const updatedUser = {
        ...mockNote,
        ...noteToUpdate,
      } as Note;

      jest.spyOn(noteRepository, 'update').mockResolvedValueOnce(undefined);
      jest
        .spyOn(noteRepository, 'findOneBy')
        .mockResolvedValueOnce(updatedUser);

      const actual = await notesRepository.update(mockId, noteToUpdate);

      expect(actual).toEqual(updatedUser);
      expect(noteRepository.update).toHaveBeenCalledWith(mockId, noteToUpdate);
      expect(noteRepository.findOneBy).toHaveBeenCalledWith(mockId);
    });
  });

  describe('Method delete', () => {
    it('should delete a note with the given id', async () => {
      const mockId = new ObjectID('615c6a81cbedb8c1a147c3ae');

      await notesRepository.delete(mockId);

      expect(noteRepository.delete).toHaveBeenCalledWith(mockId);
    });
  });

  describe('Method getByTitle', () => {
    it('should return a note with the given title', async () => {
      const mockTitle = 'Note 1';

      jest.spyOn(noteRepository, 'findOneBy').mockResolvedValueOnce(mockNote);

      const actual = await notesRepository.getByTitle(mockTitle);

      expect(actual).toEqual(mockNote);
      expect(noteRepository.findOneBy).toHaveBeenCalledWith({
        title: mockTitle,
      });
    });
  });
});
