import { Test, TestingModule } from '@nestjs/testing';
import { UserStatsService } from '../user-stats.service';
import { UserStatsSubscriber } from '../../../shared/service-bus/UserStatsSubscriber';

describe('UserStatsService', () => {
  let userStatsService: UserStatsService;
  let userStatsSubscriber: UserStatsSubscriber;
  let mockUserStatsSubscriber: jest.Mocked<Partial<UserStatsSubscriber>>;

  beforeEach(async () => {
    jest.restoreAllMocks();

    mockUserStatsSubscriber = {
      ids: [1, 2, 3],
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        UserStatsService,
        {
          provide: UserStatsSubscriber,
          useValue: mockUserStatsSubscriber,
        },
      ],
    }).compile();

    userStatsService = moduleFixture.get<UserStatsService>(UserStatsService);
    userStatsSubscriber =
      moduleFixture.get<UserStatsSubscriber>(UserStatsSubscriber);
  });

  describe('getUserStats', () => {
    it('should return user stats', async () => {
      const actual = await userStatsService.getUserStats();

      expect(actual).toEqual(userStatsSubscriber.ids);
    });
  });
});
