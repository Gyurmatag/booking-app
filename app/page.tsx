import BookingSystem from "@/components/booking-system";

export default function Page() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Elegant Cuts Hair Salon</h1>
      <p className="text-center text-muted-foreground mb-10">
        Book your next appointment with our professional stylists
      </p>
      <BookingSystem />
    </main>
  )
}

