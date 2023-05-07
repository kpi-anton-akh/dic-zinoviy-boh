import { Test } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsersController } from '../users.controller';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { UserEntity } from '../users.entity';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
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

    usersService = module.get<UsersService>(UsersService);
    usersController = module.get<UsersController>(UsersController);
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

      jest.spyOn(usersService, 'create').mockResolvedValueOnce(mockUser);

      const actual = await usersController.create(userToCreate);

      expect(usersService.create).toHaveBeenCalledWith(userToCreate);
      expect(actual).toEqual(mockUser);
    });

    it('should throw an error if a user with the same email already exists', async () => {
      const userToCreate: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
      };

      const mockError = new ConflictException(
        `User with the email "${userToCreate.email}" already exists!`,
      );

      jest.spyOn(usersService, 'create').mockRejectedValueOnce(mockError);

      await expect(usersController.create(userToCreate)).rejects.toThrow(
        mockError,
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

      jest.spyOn(usersService, 'getAll').mockResolvedValueOnce(mockUsers);

      const actual = await usersController.getAll();

      expect(usersService.getAll).toHaveBeenCalled();
      expect(actual).toBe(mockUsers);
    });
  });

  describe('Method get', () => {
    it('should return a user with the given id', async () => {
      const mockId = 1;

      jest.spyOn(usersService, 'get').mockResolvedValueOnce(mockUser);

      const actual = await usersController.get(mockId);

      expect(usersService.get).toHaveBeenCalledWith(mockId);
      expect(actual).toBe(mockUser);
    });
  });

  describe('Method update', () => {
    it('should update an existing user', async () => {
      const mockId = 1;

      const mockUpdate: UpdateUserDto = {
        name: 'Test User',
      };

      jest.spyOn(usersService, 'update').mockResolvedValueOnce(mockUser);

      const actual = await usersController.update(mockId, mockUpdate);

      expect(usersService.update).toHaveBeenCalledWith(mockId, mockUpdate);
      expect(actual).toBe(mockUser);
    });
  });

  describe('Method delete', () => {
    it('should delete a user with the given id', async () => {
      const mockId = 1;

      await usersController.delete(mockId);

      expect(usersService.delete).toHaveBeenCalledWith(mockId);
    });
  });
});
