'use client';
import React, { useState } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from 'sonner'; 
import { signOut } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Toaster } from 'sonner'; 
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const bookingFormSchema = z.object({
  activity: z.string().min(1, { message: 'Please select an activity.' }),
  date: z.string().min(1, { message: 'Please select a date.' }),
  time: z.string().min(1, { message: 'Please select a time.' }),
});

const BookingForm = () => {
  const bookingForm = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      activity: '',
      date: '',
      time: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const activities = ['Yoga', 'Gym', 'Gymnastics', 'Aqua Aerobics', 'Zumba', 'Kickboxing', 'Swimming', 'Dance', 'Pilates', 'Boxing'];
  const router = useRouter();
  async function handleBookingSubmit(values: z.infer<typeof bookingFormSchema>) {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const fullDateTime = new Date(`${values.date}T${values.time}:00`);

    if (isNaN(fullDateTime.getTime())) {
      toast.error('Invalid date or time format.');
      setIsSubmitting(false);
    }
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activity: values.activity,
        date: fullDateTime.toISOString(),
      }),
    });

    const data = await response.json();
    if (data.error) {
      toast.error('Failed to create booking. Try again.');
      setIsSubmitting(false);
      return;
    }

    const formattedDate = fullDateTime.toLocaleDateString();
    const formattedTime = fullDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    toast.success(`Your booking for ${values.activity} on ${formattedDate} at ${formattedTime} has been successfully confirmed!`);
    bookingForm.reset();

    setIsSubmitting(false);
  }

  return (
    <div className="space-y-12 max-w-md mx-auto">
      <Toaster position="bottom-right" expand={true} richColors={true} />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Book an activity</CardTitle>
          <CardDescription>Select an activity, date, and time for your booking.</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...bookingForm}>
            <form onSubmit={bookingForm.handleSubmit(handleBookingSubmit)} className="space-y-8">
              <FormField
                control={bookingForm.control}
                name="activity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="" disabled>Select an activity</option>
                        {activities.map((act) => (
                          <option key={act} value={act}>{act}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={bookingForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={bookingForm.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between space-x-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full">
                    {isSubmitting ? 'Booking...' : 'Book Now'}
                </Button>

                <Button
                  type="button"
                  onClick={() => router.push('/bookings')} 
                  className="w-full">
                  View My Bookings
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => signOut()} 
                  className="w-full">
                  Sign Out
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;
