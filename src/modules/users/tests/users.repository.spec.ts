import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersRepository } from '../users.repository';
import { UserEntity } from '../user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getRepositoryToken(UserEntity, 'postgres-db'),
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

    usersRepository = module.get<UsersRepository>(UsersRepository);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity, 'postgres-db'),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockUser = {
    id: 1,
    name: 'Test User 1',
    email: 'frank@example.com',
    password: 'testpassword',
  } as UserEntity;

  describe('Method create', () => {
    it('should create a new user with the given data', async () => {
      const createUserDto = {
        name: 'Test User 1',
        email: 'frank@example.com',
        password: 'testpassword',
      } as CreateUserDto;

      const savedUser = {
        ...mockUser,
        ...createUserDto,
      } as UserEntity;

      jest.spyOn(userRepository, 'create').mockReturnValueOnce(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(savedUser);

      const actual = await usersRepository.create(createUserDto);

      expect(actual).toEqual(savedUser);
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('Method getAll', () => {
    it('should return an array of users', async () => {
      const mockUsers: UserEntity[] = [
        {
          id: 1,
          name: 'Test User 1',
          email: 'frank@example.com',
          password: 'testpassword',
        },
        {
          id: 2,
          name: 'Test User 2',
          email: 'test@example.com',
          password: 'testpassword',
        },
      ];

      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(mockUsers);

      const actual = await usersRepository.getAll();

      expect(actual).toEqual(mockUsers);
      expect(userRepository.find).toHaveBeenCalled();
    });
  });

  describe('Method get', () => {
    it('should return a user with the given id', async () => {
      const mockId = 1;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(mockUser);

      const actual = await usersRepository.get(mockId);

      expect(actual).toEqual(mockUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: mockId });
    });
  });

  describe('Method update', () => {
    it('should update an existing user', async () => {
      const mockId = 1;
      const updateUserDto = { name: 'Updated User 1' } as UpdateUserDto;

      const updatedUser = {
        ...mockUser,
        ...updateUserDto,
      } as UserEntity;

      jest.spyOn(userRepository, 'update').mockResolvedValueOnce(undefined);
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValueOnce(updatedUser);

      const actual = await usersRepository.update(mockId, updateUserDto);

      expect(actual).toEqual(updatedUser);
      expect(userRepository.update).toHaveBeenCalledWith(mockId, updateUserDto);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: mockId });
    });
  });

  describe('Method delete', () => {
    it('should delete a user with the given id', async () => {
      const mockId = 1;

      await usersRepository.delete(mockId);

      expect(userRepository.delete).toHaveBeenCalledWith(mockId);
    });
  });

  describe('Method getByEmail', () => {
    it('should return a user with the given email', async () => {
      const mockEmail = 'frank@example.com';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(mockUser);

      const actual = await usersRepository.getByEmail(mockEmail);

      expect(actual).toEqual(mockUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: mockEmail,
      });
    });
  });
});
