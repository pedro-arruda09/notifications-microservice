package services

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/pedro-arruda09/go-notifications-microservice/types"
	"gopkg.in/gomail.v2"
)

func newEmailConfig() *types.EmailConfig {
	port, _ := strconv.Atoi(os.Getenv("SMTP_PORT"))
	return &types.EmailConfig{
		Host:      os.Getenv("SMTP_HOST"),
		Port:      port,
		Username:  os.Getenv("SMTP_USERNAME"),
		Password:  os.Getenv("SMTP_PASSWORD"),
		FromEmail: os.Getenv("SMTP_FROM_EMAIL"),
	}
}

func getMessageOptions(message types.Message) *gomail.Message {
	msg := gomail.NewMessage()

	msg.SetHeader("From", os.Getenv("SMTP_FROM_EMAIL"))
	msg.SetHeader("To", message.User.Email)
	msg.SetAddressHeader("Cc", message.User.Email, message.User.Name)

	subject := fmt.Sprintf("Subscription Confirmation - %s", message.Event.Name)
	msg.SetHeader("Subject", subject)

	body := fmt.Sprintf(`
		<html>
		<body>
			<h2>Hello %s!</h2>
			<p>Your subscription for the event was confirmed successfully!</p>

			<h3>Detalhes do Evento:</h3>
			<ul>
				<li><strong>Name:</strong> %s</li>
				<li><strong>Date:</strong> %s</li>
				<li><strong>Time:</strong> %s</li>
				<li><strong>Location:</strong> %s</li>
				<li><strong>Address:</strong> %s</li>
				<li><strong>Price:</strong> %s</li>
			</ul>

			<p><strong>Description:</strong> %s</p>

			<p>Thank you for subscribing!</p>
		</body>
		</html>
	`, message.User.Name, message.Event.Name, message.Event.Date,
		message.Event.Time, message.Event.Location, message.Event.Address,
		message.Event.Price, message.Event.Description)

	msg.SetBody("text/html", body)

	return msg
}

func SendEmail(message types.Message) error {
	emailConfig := newEmailConfig()

	msgOptions := getMessageOptions(message)

	log.Printf("✅ E-mail enviado com sucesso para %s - Evento: %s", emailConfig.FromEmail, emailConfig.Host)

	d := gomail.NewDialer(emailConfig.Host, emailConfig.Port, emailConfig.Username, emailConfig.Password)

	if err := d.DialAndSend(msgOptions); err != nil {
		log.Printf("❌ Erro ao enviar e-mail para %s: %v", message.User.Email, err)
		return fmt.Errorf("falha ao enviar e-mail: %w", err)
	}

	log.Printf("✅ E-mail enviado com sucesso para %s - Evento: %s", message.User.Email, message.Event.Name)
	return nil
}
