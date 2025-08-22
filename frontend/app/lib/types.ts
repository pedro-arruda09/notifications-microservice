export type User = {
  name: string;
  email: string;
  phone: string;
}

export type Event = {
  name: string;
  date: string;
  time: string;
  location: string;
  address: string;
  description: string;
  price: string;
}

export type TicketMessage = {
  event: Event;
  user: User;
  type?: string;
  timestamp?: string;
}