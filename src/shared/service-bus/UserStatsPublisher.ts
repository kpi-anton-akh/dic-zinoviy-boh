import {
  ServiceBusClient,
  ServiceBusSender,
  ServiceBusMessage,
} from '@azure/service-bus';
import { Injectable, Inject } from '@nestjs/common';
import { IPublisher } from './IPublisher';

@Injectable()
export class UserStatsPublisher implements IPublisher {
  protected readonly publisher: ServiceBusSender;

  constructor(
    protected readonly serviceBusClient: ServiceBusClient,
    @Inject('QUEUE_NAME') protected readonly queueName: string,
  ) {
    this.serviceBusClient = serviceBusClient;
    this.publisher = this.serviceBusClient.createSender(queueName);
  }

  async publish(message: ServiceBusMessage): Promise<void> {
    await this.publisher.sendMessages(message);
  }
}
