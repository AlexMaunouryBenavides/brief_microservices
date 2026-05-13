import { OrderCreatedPayload } from '@brief-ev/shared';

export interface IOrderEventsPublisher {
  publishOrderCreated(payload: OrderCreatedPayload): Promise<void>;
}
