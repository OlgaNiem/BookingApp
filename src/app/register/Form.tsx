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
import Link from 'next/link'


const formSchema = z.object({
  name: z.string()
    .min(2, {message: 'This field must be filled.'})
    .max(50, {message: "Your name can't be longer than 50 characters."}),

  email: z.string()
    .min(4, {message: 'This field must be filled.'})
    .email('This is not a valid email')
    .max(50, {message: "Email can't be longer than 50 characters."}),

    password: z.string()
    .min(4, {message: 'Password has to be at least 4 characters long'}),
    confirmPassword: z.string()
    .min(4, {message: 'Confirm password'}),

}).superRefine(({confirmPassword, password}, ctx) => {
    if(confirmPassword !== password) {
        ctx.addIssue({
            code:'custom',
            message: 'The passwords did not match',
            path: ['confirmPassword']
        })
    }
})


const RegisterForm = () => {
     const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch(`/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify(values)
    })

    const data = await response.json();
    if (data.error) {
      toast.error(data.error);
      return; 
    }
    toast.success('Account created')
  }
  return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <h1 className='text-2xl font-semibold'>Registration</h1>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type='name' placeholder="Write your name here..." {...field} />
                  </FormControl>
                  <FormDescription>
                  Please write your real name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder="Write your email here..." {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your email used to sign in to the app
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder=" " {...field} />
                  </FormControl>
                  <FormDescription>
                    Use a strong and secure password
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder=" " {...field} />
                  </FormControl>
                  <FormDescription>
                    Please confirm your password
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link className='block' href={'/login'}>Already have an account?</Link>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
    )
}

export default RegisterForm