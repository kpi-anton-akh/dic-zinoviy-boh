import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ServiceBusClient } from '@azure/service-bus';
import { UserStatsService } from 'src/modules/user-stats/user-stats.service';
import { UserStatsSubscriber } from 'src/modules/user-stats/service-bus/UserStatsSubscriber';
import { UserStatsController } from 'src/modules/user-stats/user-stats.controller';

describe('UserStats', () => {
  let app: INestApplication;
  let userStatsSubscriber: UserStatsSubscriber;
  let mockUserStatsSubscriber: Partial<UserStatsSubscriber>;

  beforeEach(async () => {
    jest.restoreAllMocks();

    mockUserStatsSubscriber = {
      ids: [1, 2, 3],
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        UserStatsService,
        { provide: 'QUEUE_NAME', useValue: '' },
        { provide: ServiceBusClient, useValue: {} },
        { provide: UserStatsSubscriber, useValue: mockUserStatsSubscriber },
      ],
      controllers: [UserStatsController],
    }).compile();

    app = moduleFixture.createNestApplication();
    userStatsSubscriber =
      moduleFixture.get<UserStatsSubscriber>(UserStatsSubscriber);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should get user stats', async () => {
    const response = await request(app.getHttpServer())
      .get(`/user-stats`)
      .expect(200);

    expect(response.body).toEqual(userStatsSubscriber.ids);
  });
});
