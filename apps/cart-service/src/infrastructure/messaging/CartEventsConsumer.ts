import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqpConnectionManager from 'amqp-connection-manager';
import type { ChannelWrapper } from 'amqp-connection-manager';
import type { ConfirmChannel, ConsumeMessage } from 'amqplib';
import { ORDER_EVENTS, OrderCreatedPayload } from '@brief-ev/shared';
import { ClearCartUseCase } from '../../application/use-cases/ClearCart/ClearCartUseCase';

const EXCHANGE = 'ev.platform';
const QUEUE = 'cart.order.created';

@Injectable()
export class CartEventsConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CartEventsConsumer.name);
  private connection!: amqpConnectionManager.AmqpConnectionManager;
  private channelWrapper!: ChannelWrapper;

  constructor(private readonly clearCartUseCase: ClearCartUseCase) {}

  onModuleInit(): void {
    const url = process.env['RABBITMQ_URL'] ?? 'amqp://localhost:5672';
    this.connection = amqpConnectionManager.connect([url]);

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: async (channel: ConfirmChannel) => {
        await channel.assertExchange(EXCHANGE, 'direct', { durable: true });
        await channel.assertQueue(QUEUE, { durable: true });
        await channel.bindQueue(QUEUE, EXCHANGE, ORDER_EVENTS.CREATED);
        await channel.consume(QUEUE, (msg) => this.handleMessage(channel, msg));
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.channelWrapper.close();
    await this.connection.close();
  }

  private handleMessage(channel: ConfirmChannel, msg: ConsumeMessage | null): void {
    if (!msg) return;

    void (async (): Promise<void> => {
      try {
        const payload = JSON.parse(msg.content.toString()) as OrderCreatedPayload;
        this.logger.log(`Received ${ORDER_EVENTS.CREATED} for userId=${payload.userId}`);
        await this.clearCartUseCase.execute(payload.userId);
        channel.ack(msg);
      } catch (err) {
        this.logger.error('Failed to process order.created event', err);
        channel.nack(msg, false, false);
      }
    })();
  }
}
