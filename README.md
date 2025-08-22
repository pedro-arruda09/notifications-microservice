# Go Notifications Microservice

A modern event registration system with real-time notifications using Go microservices and Next.js frontend. This project demonstrates a microservices architecture where users can register for events and receive both email and SMS notifications through a message queue system.

## 🎯 Concept

This project implements an **event registration system** with the following features:

- **Event Registration**: Users can register for events through a modern web interface
- **Dual Notifications**: Automatic email and SMS notifications sent upon registration
- **Microservices Architecture**: Decoupled services using message queues
- **Real-time Processing**: Asynchronous notification processing via RabbitMQ
- **Scalable Design**: Each service can be scaled independently

### Architecture Flow

1. **Frontend** (Next.js): User fills out registration form
2. **Message Queue** (RabbitMQ): Registration requests are queued
3. **Notification Service** (Go): Processes messages and sends notifications
4. **External Services**: Email (SMTP) and SMS (Twilio) delivery

## 🛠 Technologies Used

### Backend

- **Go 1.24.5**: High-performance microservice
- **RabbitMQ**: Message queue for asynchronous processing
- **Twilio**: SMS delivery service
- **SMTP**: Email delivery (Gomail)
- **JWT**: Authentication and security

### Frontend

- **Next.js 15.5.0**: React framework with App Router
- **React 19.1.0**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Sonner**: Toast notifications

### Infrastructure

- **Docker & Docker Compose**: Containerization and orchestration
- **RabbitMQ Management**: Queue monitoring interface

## 🚀 How to Run

### Prerequisites

- Docker and Docker Compose installed
- Go 1.24.5+ (for local development)
- Node.js 18+ (for local development)

### Quick Start with Docker

1. **Clone the repository**

   ```bash
   git clone git@github.com:pedro-arruda09/go-notifications-microservice.git
   cd go-notifications-microservice
   ```

2. **Set up environment variables**

   ```bash
   # Copy the example environment file
   cp server/.env.example server/.env

   # Edit the .env file with your credentials
   # You'll need to add:
   # - SMTP credentials for email
   # - Twilio credentials for SMS
   # - RabbitMQ connection details
   ```

3. **Start all services**

   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - **Frontend**: http://localhost:3000
   - **RabbitMQ Management**: http://localhost:15672
     - Username: `admin`
     - Password: `admin`

### Local Development

#### Backend (Go Service)

```bash
cd server
go mod download
go run cmd/main.go
```

#### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

#### RabbitMQ (Docker)

```bash
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=admin \
  rabbitmq:3-management
```

## 📁 Project Structure

```
go-notifications-microservice/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages and components
│   ├── Dockerfile           # Frontend container configuration
│   └── package.json         # Node.js dependencies
├── server/                  # Go microservice
│   ├── cmd/main.go         # Application entry point
│   ├── services/           # Business logic (email, SMS)
│   ├── types/              # Data structures
│   └── go.mod              # Go dependencies
├── docker-compose.yml      # Multi-service orchestration
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `client/` directory:

```env
# RabbitMQ Configuration
NEXT_PUBLIC_RABBITMQ_URL="amqp://admin:admin@localhost:5672"
```

Create a `.env` file in the `server/` directory:

```env
# RabbitMQ Configuration
RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com

# Twilio Configuration (SMS)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone
```

## 🧪 Testing the System

1. **Start the application** using Docker Compose
2. **Navigate to** http://localhost:3000
3. **Fill out the registration form** with your details
4. **Submit the form** - you should receive both email and SMS notifications
5. **Monitor the queue** at http://localhost:15672 to see message processing

## 📊 Monitoring

- **RabbitMQ Management**: Monitor queue health and message flow
- **Service Logs**: Check Docker logs for each service
- **Application Logs**: Go service provides detailed logging of notification delivery

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive configuration
- Consider implementing rate limiting for production use
- Add authentication for the frontend in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
