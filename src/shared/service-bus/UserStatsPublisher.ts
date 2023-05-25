import { ServiceBusClient, ServiceBusSender } from '@azure/service-bus';
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

  async publish<T extends { toString: () => string }>(
    message: T,
  ): Promise<void> {
    await this.publisher.sendMessages({ body: message.toString() });
  }
}
