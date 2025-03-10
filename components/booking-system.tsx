"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ServiceSelection from "@/components/service-selection"
import TimeSlotSelection from "@/components/time-slot-selection"
import CustomerForm from "@/components/customer-form"
import ConfirmationStep from "@/components/confirmation-step"

export type Service = {
  id: string
  name: string
  duration: number
  price: number
}

export type BookingData = {
  date: Date | undefined
  timeSlot: string | null
  service: Service | null
  customer: {
    name: string
    email: string
    phone: string
    notes: string
  } | null
}

export default function BookingSystem() {
  const [activeTab, setActiveTab] = useState("date")
  const [bookingData, setBookingData] = useState<BookingData>({
    date: undefined,
    timeSlot: null,
    service: null,
    customer: null,
  })

  const handleDateSelect = (date: Date | undefined) => {
    setBookingData({ ...bookingData, date })
  }

  // Update the handleTimeSelect function to not automatically advance to the next step
  const handleTimeSelect = (timeSlot: string) => {
    setBookingData({ ...bookingData, timeSlot })
    // Remove automatic tab change: setActiveTab("service")
  }

  // Update the handleServiceSelect function to not automatically advance to the next step
  const handleServiceSelect = (service: Service) => {
    setBookingData({ ...bookingData, service })
    // Remove automatic tab change: setActiveTab("details")
  }

  // Add these new functions to handle the "Next" button clicks
  const goToServiceStep = () => {
    if (bookingData.timeSlot) {
      setActiveTab("service")
    }
  }

  const goToDetailsStep = () => {
    if (bookingData.service) {
      setActiveTab("details")
    }
  }

  const handleCustomerSubmit = (customerData: BookingData["customer"]) => {
    setBookingData({ ...bookingData, customer: customerData })
    setActiveTab("confirm")
  }

  const handleConfirmBooking = async () => {
    // In a real app, this would send data to your backend
    console.log("Booking confirmed:", bookingData)

    // Mock API call for testing purposes
    try {
      // This is just a simulation - in a real app you'd call your actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Booking confirmed! You'll receive a confirmation email shortly.")

      // Reset booking data
      setBookingData({
        date: undefined,
        timeSlot: null,
        service: null,
        customer: null,
      })
      setActiveTab("date")
    } catch (error) {
      console.error("Booking failed:", error)
      alert("There was an error processing your booking. Please try again.")
    }
  }

  const goToTab = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto" data-testid="booking-system">
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="date" data-testid="date-tab">
              Date
            </TabsTrigger>
            <TabsTrigger value="time" data-testid="time-tab" disabled={!bookingData.date}>
              Time
            </TabsTrigger>
            <TabsTrigger value="service" data-testid="service-tab" disabled={!bookingData.timeSlot}>
              Service
            </TabsTrigger>
            <TabsTrigger value="details" data-testid="details-tab" disabled={!bookingData.service}>
              Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="date" className="py-4">
            <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={bookingData.date}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  // Disable past dates and Sundays (closed)
                  return date < new Date(new Date().setHours(0, 0, 0, 0)) || date.getDay() === 0
                }}
                className="rounded-md border"
                data-testid="date-calendar"
              />
            </div>
            {bookingData.date && (
              <div className="mt-6 text-center">
                <p className="mb-4">
                  You selected:{" "}
                  <span className="font-medium" data-testid="selected-date">
                    {format(bookingData.date, "EEEE, MMMM do, yyyy")}
                  </span>
                </p>
                <Button onClick={() => goToTab("time")} data-testid="next-to-time" disabled={!bookingData.date}>
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="time" className="py-4">
            <TimeSlotSelection
              date={bookingData.date}
              onTimeSelect={handleTimeSelect}
              selectedTime={bookingData.timeSlot}
            />
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => goToTab("date")} data-testid="back-to-date">
                Back
              </Button>
              <Button onClick={goToServiceStep} disabled={!bookingData.timeSlot} data-testid="next-to-service">
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="service" className="py-4">
            <ServiceSelection onServiceSelect={handleServiceSelect} selectedService={bookingData.service} />
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => goToTab("time")} data-testid="back-to-time">
                Back
              </Button>
              <Button onClick={goToDetailsStep} disabled={!bookingData.service} data-testid="next-to-details">
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="details" className="py-4">
            <CustomerForm onSubmit={handleCustomerSubmit} initialData={bookingData.customer} />
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => goToTab("service")} data-testid="back-to-service">
                Back
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="confirm" className="py-4">
            <ConfirmationStep
              bookingData={bookingData}
              onConfirm={handleConfirmBooking}
              onBack={() => goToTab("details")}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

