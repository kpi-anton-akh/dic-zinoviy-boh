import { Injectable } from '@nestjs/common';
import { UserStatsSubscriber } from 'src/shared/service-bus/UserStatsSubscriber';

@Injectable()
export class UserStatsService {
  constructor(private readonly userStatsSubscriber: UserStatsSubscriber) {}

  async getUserStats(): Promise<number[]> {
    return this.userStatsSubscriber.ids;
  }
}
