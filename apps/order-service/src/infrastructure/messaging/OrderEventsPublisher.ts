import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqpConnectionManager from 'amqp-connection-manager';
import type { ChannelWrapper } from 'amqp-connection-manager';
import type { ConfirmChannel } from 'amqplib';
import { IOrderEventsPublisher } from '../../domain/ports/IOrderEventsPublisher';
import { ORDER_EVENTS, OrderCreatedPayload } from '@brief-ev/shared';

const EXCHANGE = 'ev.platform';

@Injectable()
export class OrderEventsPublisher
  implements IOrderEventsPublisher, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(OrderEventsPublisher.name);
  private connection!: amqpConnectionManager.AmqpConnectionManager;
  private channelWrapper!: ChannelWrapper;

  onModuleInit(): void {
    const url = process.env['RABBITMQ_URL'] ?? 'amqp://localhost:5672';
    this.connection = amqpConnectionManager.connect([url]);
    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel: ConfirmChannel) =>
        channel.assertExchange(EXCHANGE, 'direct', { durable: true }),
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.channelWrapper.close();
    await this.connection.close();
  }

  async publishOrderCreated(payload: OrderCreatedPayload): Promise<void> {
    await this.channelWrapper.publish(EXCHANGE, ORDER_EVENTS.CREATED, payload, {
      persistent: true,
    });
    this.logger.log(`Published ${ORDER_EVENTS.CREATED} for orderId=${payload.orderId}`);
  }
}
