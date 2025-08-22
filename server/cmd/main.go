package main

import (
	"encoding/json"
	"log"
	"os"

	"github.com/pedro-arruda09/go-notifications-microservice/services"
	"github.com/pedro-arruda09/go-notifications-microservice/types"
	amqp "github.com/rabbitmq/amqp091-go"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

func handleMessage(message types.Message) {
	switch message.Type {
	case "create-email":
		err := services.SendEmail(message)
		if err != nil {
			log.Printf("❌ Erro ao enviar e-mail para %s: %v", message.User.Email, err)
		} else {
			log.Printf("✅ E-mail enviado com sucesso para %s - Evento: %s", message.User.Email, message.Event.Name)
		}
	case "create-sms":
		err := services.SendSMS(message)
		if err != nil {
			log.Printf("❌ Erro ao enviar SMS para %s: %v", message.User.Phone, err)
		} else {
			log.Printf("✅ SMS enviado com sucesso para %s - Evento: %s", message.User.Phone, message.Event.Name)
		}
	}
}

func main() {
	rabbitMQUrl := os.Getenv("RABBITMQ_URL")

	conn, err := amqp.Dial(rabbitMQUrl)
	failOnError(err, "Error connecting to RabbitMQ!")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel!")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"tickets-queue", // name
		true,            // durable
		false,           // delete when unused
		false,           // exclusive
		false,           // no-wait
		nil,             // arguments
	)
	failOnError(err, "Error declaring queue!")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	failOnError(err, "Failed to register a consumer")

	forever := make(chan struct{})

	go func() {
		for d := range msgs {
			var message types.Message
			err := json.Unmarshal(d.Body, &message)
			failOnError(err, "Error unmarshalling message")

			handleMessage(message)
		}
	}()

	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	<-forever
}
