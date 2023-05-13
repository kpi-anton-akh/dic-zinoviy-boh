import * as request from 'supertest';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { SharedModule } from 'src/shared/shared.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/modules/users/users.module';
import { User } from 'src/modules/users/user.entity';
import { CreateUserDto, UpdateUserDto } from 'src/modules/users/dtos/index';

describe('Users', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let db: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          name: 'postgres-db',
          imports: [SharedModule],
          inject: [ApiConfigService],
          useFactory: (configService: ApiConfigService) => ({
            ...configService.sqliteConfig,
            name: 'postgres-db',
            entities: [User],
          }),
          dataSourceFactory: async (options) => {
            dataSource = await new DataSource(options).initialize();
            return dataSource;
          },
        }),
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    db = dataSource.getRepository(User);

    await app.init();
  });

  beforeEach(async () => {
    await db.insert([
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
      {
        id: 3,
        name: 'Test User 3',
        email: 'test3@example.com',
        password: 'testpassword3',
      },
    ]);
  });

  afterEach(async () => {
    await dataSource.synchronize(true);
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  it('should create a user', async () => {
    const newUser: CreateUserDto = {
      name: 'New Test User',
      email: 'newtestuser@example.com',
      password: 'testpassword',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(newUser)
      .expect(201);

    const createdUser = await db.findOneBy({ id: response.body.id });

    const usersAfterCreate = await db.find();

    expect(createdUser).toMatchObject(newUser);
    expect(createdUser.id).toBe(4);
    expect(usersAfterCreate.length).toBe(4);
  });

  it('should get all users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    const expectedUsers = await db.find();

    expect(response.body).toEqual(expect.arrayContaining(expectedUsers));
  });

  it('should get a user by id', async () => {
    const userId = 1;
    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200);

    const expectedUser = await db.findOneBy({ id: userId });

    expect(response.body).toEqual(expectedUser);
  });

  it('should update a user', async () => {
    const userId = 1;
    const updatedUser: UpdateUserDto = {
      name: 'Updated Test User',
    };

    await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .send(updatedUser)
      .expect(200);

    const user = await db.findOneBy({ id: userId });

    expect(user.name).toBe(updatedUser.name);
    expect(user.id).toBe(userId);
  });

  it('should delete a user', async () => {
    const userId = 1;

    await request(app.getHttpServer()).delete(`/users/${userId}`).expect(200);

    const deletedUser = await db.findOneBy({ id: userId });

    const usersAfterDelete = await db.find();

    expect(deletedUser).toBeNull();
    expect(usersAfterDelete.length).toBe(2);
  });
});
