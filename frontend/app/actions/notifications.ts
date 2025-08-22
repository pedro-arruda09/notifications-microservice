"use server";

import { RabbitMQService } from "../lib/rabbitmq";
import { TicketMessage } from "../lib/types";

export async function sendEventRegistration(data: TicketMessage) {
  try {
    await RabbitMQService.publishMessage(data);
    return { success: true, message: 'Registration sent successfully' };
  } catch (error) {
    console.error('Error sending registration:', error);
    return { success: false, message: 'Failed to send registration' };
  }
}