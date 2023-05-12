import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import { UserEntity } from '../user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            get: jest.fn(),
            getAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockUser: UserEntity = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpassword',
  };

  describe('Method create', () => {
    it('should create a new user with the given data', async () => {
      const userToCreate: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
      };

      jest.spyOn(usersRepository, 'getByEmail').mockResolvedValue(null);
      jest.spyOn(usersRepository, 'create').mockResolvedValue(mockUser);

      const actual = await usersService.create(userToCreate);

      expect(usersRepository.getByEmail).toHaveBeenCalledWith(
        userToCreate.email,
      );
      expect(usersRepository.create).toHaveBeenCalledWith(userToCreate);
      expect(actual).toEqual(mockUser);
    });

    it('should throw an error if a user with the same email already exists', async () => {
      const userToCreate: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
      };

      jest.spyOn(usersRepository, 'getByEmail').mockResolvedValue(mockUser);

      await expect(usersService.create(userToCreate)).rejects.toThrow(
        new ConflictException(
          `User with the email "${userToCreate.email}" already exists!`,
        ),
      );
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

      jest.spyOn(usersRepository, 'getAll').mockResolvedValue(mockUsers);

      const actual = await usersService.getAll();

      expect(usersRepository.getAll).toHaveBeenCalled();
      expect(actual).toEqual(mockUsers);
    });
  });

  describe('Method get', () => {
    it('should return a user with the given id', async () => {
      const mockId = 1;

      jest.spyOn(usersRepository, 'get').mockResolvedValue(mockUser);

      const actual = await usersService.get(mockId);

      expect(usersRepository.get).toHaveBeenCalledWith(mockId);
      expect(actual).toEqual(mockUser);
    });
  });

  describe('Method update', () => {
    it('should update an existing user', async () => {
      const mockId = 1;

      const mockUpdate: UpdateUserDto = {
        name: 'Updated Test User',
      };

      jest.spyOn(usersRepository, 'update').mockResolvedValue({
        ...mockUser,
        ...mockUpdate,
      });

      const actual = await usersService.update(mockId, mockUpdate);

      expect(usersRepository.update).toHaveBeenCalledWith(mockId, mockUpdate);
      expect(actual).toEqual({
        ...mockUser,
        ...mockUpdate,
      });
    });
  });

  describe('Method delete', () => {
    it('should delete a user with the given id', async () => {
      const mockId = 1;

      await usersService.delete(mockId);

      expect(usersRepository.delete).toHaveBeenCalledWith(mockId);
    });
  });
});
