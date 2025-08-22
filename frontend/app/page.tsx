"use client";

import { useState } from "react";
import { sendEventRegistration } from "./actions/notifications";
import { toast } from "sonner";
import { TicketMessage } from "./lib/types";

// Mocked event data
const eventData = {
  title: "Tech Conference 2024",
  date: "December 15, 2024",
  time: "09:00 - 18:00",
  location: "São Paulo Convention Center",
  address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
  description:
    "The biggest technology conference in Brazil. Come discover the latest trends in development, AI, cloud computing and much more.",
  speakers: [
    "Dr. Ana Silva - AI Specialist",
    "João Santos - CTO at TechCorp",
    "Maria Costa - Product Leader",
    "Pedro Oliveira - Software Architect",
  ],
  price: "$299.00",
  capacity: 500,
  registered: 342,
};

export default function EventPage() {
  const [formData, setFormData] = useState<TicketMessage>({
    event: {
      name: eventData.title,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      address: eventData.address,
      description: eventData.description,
      price: eventData.price,
    },
    user: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const [emailResult, createSms] = await Promise.all([
        sendEventRegistration({
        ...formData,
        timestamp: new Date().toISOString(),
        type: 'create-email',
      }),
      sendEventRegistration({
        ...formData,
        user: {
          ...formData.user,
          phone: `+55${formData.user.phone.replace(/\D/g, '')}`,
        },
        timestamp: new Date().toISOString(),
        type: 'create-sms',
      }),
    ]);

      if (emailResult?.success && createSms?.success) {
        toast.success("Registration completed successfully!");
      } else {
        toast.error("Registration failed!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {eventData.title}
            </h1>
            <div className="flex justify-center items-center gap-4 text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1">
                📅 {eventData.date}
              </span>
              <span className="flex items-center gap-1">
                ⏰ {eventData.time}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  📍 Location
                </h3>
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                  {eventData.location}
                </p>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  {eventData.address}
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  💰 Price
                </h3>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {eventData.price}
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  👥 Capacity
                </h3>
                <p className="text-purple-800 dark:text-purple-200">
                  {eventData.registered} / {eventData.capacity} registered
                </p>
                <div className="w-full bg-purple-200 dark:bg-purple-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (eventData.registered / eventData.capacity) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  📝 About the Event
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {eventData.description}
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  🎤 Confirmed Speakers
                </h3>
                <ul className="space-y-1">
                  {eventData.speakers.map((speaker, index) => (
                    <li
                      key={index}
                      className="text-orange-800 dark:text-orange-200 text-sm"
                    >
                      • {speaker}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            📝 Register for the Event
          </h2>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.user.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                E-mail *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.user.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.user.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="(11) 99999-9999"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
              disabled={isSubmitting}
            >
              🎫 Confirm Registration
            </button>
            {isSubmitting && (
              <span className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending registration...
              </span>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
