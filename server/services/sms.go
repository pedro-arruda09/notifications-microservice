package services

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/pedro-arruda09/go-notifications-microservice/types"
	"github.com/twilio/twilio-go"
	twilioApi "github.com/twilio/twilio-go/rest/api/v2010"
)

func SendSMS(message types.Message) error {
	accountSid := os.Getenv("TWILIO_ACCOUNT_SID")
	authToken := os.Getenv("TWILIO_AUTH_TOKEN")

	client := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: accountSid,
		Password: authToken,
	})

	params := &twilioApi.CreateMessageParams{}
	params.SetTo(message.User.Phone)
	params.SetFrom(os.Getenv("TWILIO_PHONE_NUMBER"))
	params.SetBody(fmt.Sprintf("Hello %s!\n\n Your subscription for the event %s was confirmed successfully!", message.User.Name, message.Event.Name))

	resp, err := client.Api.CreateMessage(params)
	if err != nil {
		log.Printf("Error sending SMS message: %v", err)
		return err
	}

	response, _ := json.Marshal(*resp)
	log.Printf("Response: %s", string(response))

	return nil
}