package types

import "time"

type Event struct {
	Name        string `json:"name"`
	Date        string `json:"date"`
	Time        string `json:"time"`
	Location    string `json:"location"`
	Address     string `json:"address"`
	Description string `json:"description"`
	Price       string `json:"price"`
}

type User struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Phone string `json:"phone"`
}

type Message struct {
	Event     Event     `json:"event"`
	User      User      `json:"user"`
	Timestamp time.Time `json:"timestamp"`
	Type      string    `json:"type"`
}

type EmailConfig struct {
	Host      string
	Port      int
	Username  string
	Password  string
	FromEmail string
}

type EmailReceiver struct {
	Email string
	Name  string
}

type TicketContent struct {
	EventName string
	EventDate string
}

type EmailContent struct {
	Sender   string
	Receiver EmailReceiver
	Subject  string
	Ticket   TicketContent
}
