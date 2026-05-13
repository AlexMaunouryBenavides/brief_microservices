import { IOrderEventsPublisher } from '../../domain/ports/IOrderEventsPublisher';
import { OrderCreatedPayload } from '@brief-ev/shared';

export class FakeOrderEventsPublisher implements IOrderEventsPublisher {
  publishedEvents: OrderCreatedPayload[] = [];

  async publishOrderCreated(payload: OrderCreatedPayload): Promise<void> {
    this.publishedEvents.push(payload);
  }
}
