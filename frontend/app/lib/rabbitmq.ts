import amqp from 'amqplib';
import { TicketMessage } from './types';

export class RabbitMQService {
  private static connection: amqp.Connection | null = null;
  private static channel: amqp.Channel | null = null;

  static async connect() {
    if (!this.connection) {
      this.connection = await amqp.connect(process.env.NEXT_PUBLIC_RABBITMQ_URL)
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue('tickets-queue', { durable: true });
    }

    return this.channel;
  }

  static async publishMessage(message: TicketMessage) {
    const channel = await this.connect();
    return channel?.sendToQueue('tickets-queue', Buffer.from(JSON.stringify(message)));
  }

  static async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}