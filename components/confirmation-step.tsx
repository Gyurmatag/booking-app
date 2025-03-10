"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { BookingData } from "./booking-system"
import { useState } from "react"
import { Loader2 } from "lucide-react"

type ConfirmationStepProps = {
  bookingData: BookingData
  onConfirm: () => Promise<void>
  onBack: () => void
}

export default function ConfirmationStep({ bookingData, onConfirm, onBack }: ConfirmationStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      await onConfirm()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!bookingData.date || !bookingData.timeSlot || !bookingData.service || !bookingData.customer) {
    return <p>Missing booking information. Please go back and complete all steps.</p>
  }

  return (
    <div data-testid="confirmation-step">
      <h2 className="text-xl font-semibold mb-4">Confirm Your Appointment</h2>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">Appointment Details</h3>
              <p data-testid="confirm-date">
                <span className="font-medium">Date:</span> {format(bookingData.date, "EEEE, MMMM do, yyyy")}
              </p>
              <p data-testid="confirm-time">
                <span className="font-medium">Time:</span> {bookingData.timeSlot}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-lg">Service</h3>
              <p data-testid="confirm-service">
                <span className="font-medium">{bookingData.service.name}</span>
              </p>
              <p data-testid="confirm-duration">Duration: {bookingData.service.duration} minutes</p>
              <p className="text-lg font-bold mt-1" data-testid="confirm-price">
                ${bookingData.service.price}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-lg">Your Information</h3>
              <p data-testid="confirm-customer-name">
                <span className="font-medium">Name:</span> {bookingData.customer.name}
              </p>
              <p data-testid="confirm-customer-email">
                <span className="font-medium">Email:</span> {bookingData.customer.email}
              </p>
              <p data-testid="confirm-customer-phone">
                <span className="font-medium">Phone:</span> {bookingData.customer.phone}
              </p>
              {bookingData.customer.notes && (
                <div className="mt-2">
                  <p className="font-medium">Special Requests:</p>
                  <p className="text-sm" data-testid="confirm-customer-notes">
                    {bookingData.customer.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between">
            <Button variant="outline" onClick={onBack} disabled={isSubmitting} data-testid="back-button">
              Back
            </Button>
            <Button onClick={handleConfirm} disabled={isSubmitting} data-testid="confirm-booking-button">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

