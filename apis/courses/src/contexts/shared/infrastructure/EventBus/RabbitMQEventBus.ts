import amqp, { Channel, Message } from 'amqplib';

import { Injectable } from '@studio/dependency-injection';

import { DomainEvent } from '../../domain/DomainEvent';
import { DomainEventSubscriber } from '../../domain/DomainEventSubscriber';
import { EventBus } from '../../domain/EventBus';
import { env } from '../../../../api/config/env';
import { sleep } from '../../../../utils/sleep';
import { error, info } from '@studio/api-utils';

const RETRY_TIME = 3000;

@Injectable()
export class RabbitMQEventBus implements EventBus {
  public readonly subscriptions: Map<
    string,
    Array<DomainEventSubscriber<DomainEvent>>
  > = new Map<string, Array<DomainEventSubscriber<DomainEvent>>>();

  private channel?: Channel;
  private queueName?: string;

  constructor() {
    this.intialize();
  }

  async intialize() {
    try {
      const connection = await amqp.connect(
        `amqp://${env.rabbit.host}:${env.rabbit.port}`
      );
      const queueName = env.rabbit.event_queue;
      const channel = await connection.createChannel();
      channel.assertQueue(queueName, { durable: true });
      channel.consume(
        queueName,
        (msg: Message | null) => {
          if (msg) {
            const event = JSON.parse(msg.content.toString());
            if (!event.eventName) return;
            const handlers = this.subscriptions.get(event.eventName);
            if (!handlers) return;
            handlers.forEach((handler) => {
              void handler.on(event);
            });
          }
        },
        { noAck: true }
      );
      info('Connected EventBus to RabbitMQ');
      this.channel = channel;
      this.queueName = queueName;
    } catch (err) {
      error(`Error connecting to rabbit, retrying on ${RETRY_TIME}ms\n ${err}`);
      await sleep(RETRY_TIME);
      this.intialize();
    }
  }

  async publish(events: Array<DomainEvent>): Promise<void> {
    events.map((event) => {
      const eventAsString = JSON.stringify(event);
      if (!this.channel || !this.queueName) return;
      this.channel.sendToQueue(this.queueName, Buffer.from(eventAsString));
    });
  }
  addSubscribers(subscribers: Array<DomainEventSubscriber<DomainEvent>>): void {
    subscribers.forEach((subscriber) => {
      subscriber.subscribedTo().forEach((event) => {
        const previousSubscribersToEvent = this.subscriptions.get(
          event.EVENT_NAME
        );

        if (!previousSubscribersToEvent) {
          this.subscriptions.set(event.EVENT_NAME, [subscriber]);
          return;
        }
        this.subscriptions.set(event.EVENT_NAME, [
          ...previousSubscribersToEvent,
          subscriber,
        ]);
      });
    });
  }
}
