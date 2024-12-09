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
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  email: z.string()
    .min(4, {message: 'This field must be filled.'})
    .email('This is not a valid email')
    .max(50, {message: "Email can't be longer than 50 characters."}),

    password: z.string()
    .min(4, {message: 'Password has to be at least 4 characters long'}),
    //.max(200, {message: "Password can't be longer than 200 characters."}),
})

const LoginForm = () => {
    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })
const router = useRouter();
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    })
    if (!response?.error) {
      router.push('/dashboard')
    }
    toast.success('You are now signed in')
  }
  return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <h1 className='text-2xl font-semibold'>Login</h1>            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type='email' placeholder="Write your email here..." {...field} />
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <Link className='block' href={'/register'}>Don't have an account?</Link>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
    )
}

export default LoginForm