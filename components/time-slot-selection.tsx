"use client"

import { Button } from "@/components/ui/button"
import { format } from "date-fns"

type TimeSlotSelectionProps = {
  date: Date | undefined
  onTimeSelect: (time: string) => void
  selectedTime: string | null
}

export default function TimeSlotSelection({ date, onTimeSelect, selectedTime }: TimeSlotSelectionProps) {
  // In a real app, these would come from your backend based on availability
  const availableTimeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ]

  if (!date) return null

  return (
    <div data-testid="time-slot-selection">
      <h2 className="text-xl font-semibold mb-4">Select a Time</h2>
      <p className="mb-4">
        Available times for <span className="font-medium">{format(date, "EEEE, MMMM do")}</span>:
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {availableTimeSlots.map((time) => (
          <Button
            key={time}
            variant={selectedTime === time ? "default" : "outline"}
            className="h-12"
            onClick={() => onTimeSelect(time)}
            data-testid={`time-slot-${time.replace(":", "-")}`}
          >
            {time}
          </Button>
        ))}
      </div>

      {selectedTime && (
        <p className="mt-4 text-center">
          Selected time:{" "}
          <span className="font-medium" data-testid="selected-time">
            {selectedTime}
          </span>
        </p>
      )}
    </div>
  )
}

