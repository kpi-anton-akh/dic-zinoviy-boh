import {
  ServiceBusClient,
  ServiceBusReceiver,
  ServiceBusReceivedMessage,
  ProcessErrorArgs,
} from '@azure/service-bus';
import { Injectable, Inject } from '@nestjs/common';
import { ISubscriber } from './ISubscriber';

@Injectable()
export class UserStatsSubscriber implements ISubscriber {
  protected readonly subscriber: ServiceBusReceiver;
  private _ids: number[] = [];

  constructor(
    protected readonly serviceBusClient: ServiceBusClient,
    @Inject('QUEUE_NAME') protected readonly queueName: string,
  ) {
    this.serviceBusClient = serviceBusClient;
    this.subscriber = this.serviceBusClient.createReceiver(queueName);
  }

  get ids() {
    return this._ids;
  }

  async subscribe(): Promise<void> {
    this.subscriber.subscribe({
      processMessage: async (message: ServiceBusReceivedMessage) => {
        this.ids.push(parseInt(message.body.toString()));
        await this.subscriber.completeMessage(message);
      },
      processError: async (args: ProcessErrorArgs) => {
        console.error(args.error);
      },
    });
  }
}
