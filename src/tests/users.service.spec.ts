import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../modules/users/services/users.service';
import { UserEntity } from '../modules/users/entities/users.entity';
import { CreateUserDto, UpdateUserDto } from '../modules/users/dtos/index';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    userRepository = moduleRef.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const user = new UserEntity();
      user.id = 1;
      user.name = 'Test User';
      user.email = 'test@example.com';
      user.password = 'testpassword';

      jest.spyOn(userRepository, 'find').mockResolvedValueOnce([user]);

      const result = await usersService.findAll();

      expect(result).toEqual([user]);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = new UserEntity();
      user.id = 1;
      user.name = 'Test User';
      user.email = 'test@example.com';
      user.password = 'testpassword';

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);

      const result = await usersService.findOne(1);

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

      const user = new UserEntity();
      user.id = 1;
      user.name = userDto.name;
      user.email = userDto.email;
      user.password = userDto.password;

      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);

      const result = await usersService.create(userDto);

      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const userDto: UpdateUserDto = {
        name: 'Updated User',
      };

      const existingUser = new UserEntity();
      existingUser.id = 1;
      existingUser.name = 'Test User';
      existingUser.email = 'test@example.com';
      existingUser.password = 'testpassword';

      const updatedUser = new UserEntity();
      updatedUser.id = 1;
      updatedUser.name = userDto.name;
      updatedUser.email = existingUser.email;
      updatedUser.password = existingUser.password;

      jest.spyOn(userRepository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(updatedUser);

      const result = await usersService.update(existingUser.id, userDto);

      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const userId = 1;
      jest.spyOn(userRepository, 'delete').mockResolvedValue(undefined);

      await usersService.remove(userId);

      expect(userRepository.delete).toHaveBeenCalledWith(userId);
    });
  });
});
