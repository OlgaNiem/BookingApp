'use client'

import React from 'react'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { reloadSession } from '../../../lib/funcs'


const formSchema = z.object({
  email: z.string()
    .min(4, {message: 'This field must be filled.'})
    .email('This is not a valid email')
    .max(50, {message: "Email can't be longer than 50 characters."}),
})


const DashboardForm = ({email}: {email: string}) => {
    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {email},
  })
  const {data: session, update} = useSession();
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch(`/api/updateEmail`, {
      method: 'POST',
      body: JSON.stringify(values)
    })

    const data = await response.json();
    if (data.error) {
      toast.error(data.error);
      return;
    }

    update({
      ...session,
      user: {...session?.user, email: values.email }
    })

    reloadSession();

    toast.success('Email changed')
  }
  return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <h1 className='text-2xl font-semibold'>Modify your email</h1>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder="Write your new email here..." {...field} />
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
    )
}

export default DashboardForm