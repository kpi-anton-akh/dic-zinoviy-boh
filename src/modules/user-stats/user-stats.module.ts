import { ServiceBusClient } from '@azure/service-bus';
import { Module } from '@nestjs/common';
import { UserStatsPublisher } from 'src/modules/user-stats/service-bus/UserStatsPublisher';
import { UserStatsSubscriber } from 'src/modules/user-stats/service-bus/UserStatsSubscriber';
import { UserStatsService } from './user-stats.service';
import { UserStatsController } from './user-stats.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      inject: [ConfigService],
      provide: ServiceBusClient,
      useFactory: (configService: ConfigService) => {
        return new ServiceBusClient(
          configService.get('AZURE_SERVICE_BUS_CONNECTION'),
        );
      },
    },
    { provide: 'QUEUE_NAME', useValue: 'user-stats' },
    UserStatsPublisher,
    UserStatsSubscriber,
    UserStatsService,
  ],
  controllers: [UserStatsController],
  exports: [UserStatsPublisher],
})
export class UserStatsModule {}
