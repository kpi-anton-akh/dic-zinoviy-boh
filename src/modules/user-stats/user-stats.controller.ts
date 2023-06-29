import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserStatsService } from './user-stats.service';

@ApiTags('User Stats')
@Controller('/user-stats')
export class UserStatsController {
  constructor(private userStatsService: UserStatsService) {}

  @Get()
  getUserStats() {
    return this.userStatsService.getUserStats();
  }
}
