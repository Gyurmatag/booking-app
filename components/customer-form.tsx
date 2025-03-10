"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { BookingData } from "./booking-system"

type CustomerFormProps = {
  onSubmit: (data: BookingData["customer"]) => void
  initialData: BookingData["customer"]
}

export default function CustomerForm({ onSubmit, initialData }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    notes: initialData?.notes || "",
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { name: "", email: "", phone: "" }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      valid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} data-testid="customer-form">
      <h2 className="text-xl font-semibold mb-4">Your Information</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            data-testid="customer-name"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1" data-testid="name-error">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            data-testid="customer-email"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1" data-testid="email-error">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(123) 456-7890"
            data-testid="customer-phone"
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1" data-testid="phone-error">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="notes">Special Requests (Optional)</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any special requests or notes for your stylist"
            rows={3}
            data-testid="customer-notes"
          />
        </div>
      </div>

      <Button type="submit" className="mt-6 w-full" data-testid="submit-customer-info">
        Continue to Confirmation
      </Button>
    </form>
  )
}

