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

  // Add real-time validation as user types
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        if (!value.trim()) {
          return "Name is required"
        } else if (value.trim().length < 2) {
          return "Name must be at least 2 characters"
        }
        break
      case "email":
        if (!value.trim()) {
          return "Email is required"
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          return "Please enter a valid email address"
        }
        break
      case "phone":
        if (!value.trim()) {
          return "Phone number is required"
        } else if (!/^[\d\s()+-]{10,15}$/.test(value)) {
          return "Please enter a valid phone number"
        }
        break
    }
    return ""
  }

  // Update handleChange to include real-time validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Only validate after user has started typing
    if (formData[name as keyof typeof formData] !== "") {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  // Add a blur handler for validation when user leaves a field
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  // Update the validateForm function with more robust validation
  const validateForm = () => {
    let valid = true
    const newErrors = { name: "", email: "", phone: "" }

    // Name validation - require at least 2 characters
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      valid = false
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
      valid = false
    }

    // Email validation with more comprehensive regex
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      valid = false
    }

    // Phone validation - basic format check
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
      valid = false
    } else if (!/^[\d\s()+-]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
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
            onBlur={handleBlur}
            placeholder="John Doe"
            data-testid="customer-name"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1" data-testid="name-error" id="name-error" role="alert">
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
            onBlur={handleBlur}
            placeholder="john@example.com"
            data-testid="customer-email"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1" data-testid="email-error" id="email-error" role="alert">
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
            onBlur={handleBlur}
            placeholder="(123) 456-7890"
            data-testid="customer-phone"
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1" data-testid="phone-error" id="phone-error" role="alert">
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

