import { Test } from '@nestjs/testing';
import { UsersController } from '../modules/users/controllers/users.controller';
import { CreateUserDto, UpdateUserDto } from '../modules/users/dtos';
import { UserEntity } from '../modules/users/entities/users.entity';
import { UsersService } from '../modules/users/services/users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: UserEntity[] = [
        {
          id: 1,
          name: 'Test User 1',
          email: 'test1@example.com',
          password: 'testpassword1',
        },
        {
          id: 2,
          name: 'Test User 2',
          email: 'test2@example.com',
          password: 'testpassword2',
        },
      ];

      jest.spyOn(usersService, 'findAll').mockResolvedValueOnce(users);

      const result = await usersController.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user: UserEntity = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(user);

      const result = await usersController.findOne(user.id);

      expect(result).toEqual(user);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
      };

      const user: UserEntity = {
        id: 1,
        name: userDto.name,
        email: userDto.email,
        password: userDto.password,
      };

      jest.spyOn(usersService, 'create').mockResolvedValueOnce(user);

      const result = await usersController.create(userDto);

      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const userDto: UpdateUserDto = {
        name: 'Updated User',
      };

      const existingUser: UserEntity = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
      };

      const updatedUser: UserEntity = {
        id: existingUser.id,
        name: userDto.name,
        email: existingUser.email,
        password: existingUser.password,
      };

      jest.spyOn(usersService, 'update').mockResolvedValueOnce(updatedUser);

      const result = await usersController.update(existingUser.id, userDto);

      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const userId = 1;
      jest.spyOn(usersService, 'remove').mockResolvedValueOnce(undefined);

      await usersController.remove(userId);

      expect(usersService.remove).toHaveBeenCalledWith(userId);
    });
  });
});
