import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqpConnectionManager from 'amqp-connection-manager';
import type { ChannelWrapper } from 'amqp-connection-manager';
import type { ConfirmChannel } from 'amqplib';
import { USER_EVENTS, UserRegisteredPayload } from '@brief-ev/shared';

const EXCHANGE = 'ev.platform';

@Injectable()
export class UserEventsPublisher implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UserEventsPublisher.name);
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

  async publishUserRegistered(payload: UserRegisteredPayload): Promise<void> {
    await this.channelWrapper.publish(EXCHANGE, USER_EVENTS.REGISTERED, payload, {
      persistent: true,
    });
    this.logger.log(`Published ${USER_EVENTS.REGISTERED} for userId=${payload.userId}`);
  }
}
