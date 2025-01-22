'use client';

import React, { useState } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from 'sonner'; 
import { Button } from "@/components/ui/button";
import { Toaster } from 'sonner'; 
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useSession } from 'next-auth/react';
import { reloadSession } from '../../../lib/funcs';

const emailFormSchema = z.object({
  email: z.string()
    .min(4, { message: 'This field must be filled.' })
    .email('This is not a valid email')
    .max(50, { message: "Email can't be longer than 50 characters." }),
});

const bookingFormSchema = z.object({
  activity: z.string().min(1, { message: 'Please select an activity.' }),
  date: z.string().min(1, { message: 'Please select a date.' }),
  time: z.string().min(1, { message: 'Please select a time.' }),
});

const DashboardForm = ({ email }: { email: string }) => {

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email },
  });

  const { data: session, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false); 
  
  async function handleEmailSubmit(values: z.infer<typeof emailFormSchema>) {
    const response = await fetch(`/api/updateEmail`, {
      method: 'POST',
      body: JSON.stringify(values),
    });

    const data = await response.json();
    if (data.error) {
      toast.error(data.error); 
      return;
    }

    update({
      ...session,
      user: { ...session?.user, email: values.email },
    });

    reloadSession();

    toast.success('Email changed'); 
  }

    const bookingForm = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      activity: '',
      date: '',
      time: '',
    },
  });

  const activities = ['Yoga', 'Gym', 'Gymnastics', 'Aqua Aerobics', 'Zumba', 'Kickboxing', 'Swimming', 'Dance', 'Pilates', 'Boxing'];

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

    toast.success(`Your booking for ${values.activity} on ${formattedDate} at ${formattedTime} has been successfully confirmed!`); // Показать успех через toast
    bookingForm.reset();

    setIsSubmitting(false); 
  }

  return (
    <div className="space-y-12">
      <Toaster position="bottom-right" expand={true} richColors={true} />
      <Form {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-8">
          <h1 className="text-2xl font-semibold">Modify your email</h1>
          <FormField
            control={emailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Write your new email here..." {...field} />
                </FormControl>
                <FormDescription>
                  This is your email used to sign in to the app
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Change email</Button>
        </form>
      </Form>

      <Form {...bookingForm}>
        <form onSubmit={bookingForm.handleSubmit(handleBookingSubmit)} className="space-y-8">
          <h1 className="text-2xl font-semibold">Book an activity</h1>
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
                    <option value="" disabled>
                      Select an activity
                    </option>
                    {activities.map((act) => (
                      <option key={act} value={act}>
                        {act}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormDescription>Select the activity you want to book</FormDescription>
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
                <FormDescription>Select the date for your booking</FormDescription>
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
                <FormDescription>Select the time for your booking</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Booking...' : 'Book Now'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DashboardForm;
