import { ServiceBusMessage } from '@azure/service-bus';

export interface IPublisher {
  publish: (message: ServiceBusMessage) => Promise<void>;
}
