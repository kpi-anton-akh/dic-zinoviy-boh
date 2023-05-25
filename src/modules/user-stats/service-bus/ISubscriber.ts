export interface ISubscriber {
  subscribe: () => Promise<void>;
}
