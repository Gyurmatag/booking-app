"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Service } from "./booking-system"

type ServiceSelectionProps = {
  onServiceSelect: (service: Service) => void
  selectedService: Service | null
}

export default function ServiceSelection({ onServiceSelect, selectedService }: ServiceSelectionProps) {
  // In a real app, these would come from your backend
  const services: Service[] = [
    { id: "haircut", name: "Haircut", duration: 30, price: 35 },
    { id: "haircut-style", name: "Haircut & Styling", duration: 45, price: 50 },
    { id: "color", name: "Hair Coloring", duration: 90, price: 85 },
    { id: "highlights", name: "Highlights", duration: 120, price: 110 },
    { id: "blowout", name: "Blowout", duration: 30, price: 30 },
    { id: "treatment", name: "Hair Treatment", duration: 45, price: 45 },
  ]

  return (
    <div data-testid="service-selection">
      <h2 className="text-xl font-semibold mb-4">Select a Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all ${selectedService?.id === service.id ? "border-primary" : ""}`}
            onClick={() => onServiceSelect(service)}
            data-testid={`service-${service.id}`}
          >
            <CardHeader className="pb-2">
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.duration} minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${service.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedService && (
        <div className="mt-4 text-center">
          <p>
            Selected service:{" "}
            <span className="font-medium" data-testid="selected-service">
              {selectedService.name}
            </span>{" "}
            - ${selectedService.price}
          </p>
        </div>
      )}
    </div>
  )
}

