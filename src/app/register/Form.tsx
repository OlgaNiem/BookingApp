'use client'
import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from 'next-auth/react'
import { Toaster } from 'sonner'; 

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

  const router = useRouter();

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
    toast.success('Account created');

    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
  
    if (result?.error) {
      toast.error('Failed to sign in. Try logging in manually.');
      router.push('/login');
    } else {
      // If sign-in is successful, directly replace the page with the home page
      router.replace('/');
    }
  }

  return (
    <div className="mt-32 my-20 flex justify-center">
      <Toaster position="bottom-right" expand={true} richColors={true} />
      <Card className="w-full mt-32 max-w-md mx-auto shadow-lg p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder="Write your name here..." {...field} />
                    </FormControl>
                    <FormDescription>Please write your real name</FormDescription>
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
                    <FormDescription>This is your email used to sign in to the app</FormDescription>
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
                    <FormDescription>Use a strong and secure password</FormDescription>
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
                    <FormDescription>Please confirm your password</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Link className='block text-sm text-center text-blue-500 hover:underline' href={'/login'}>Already have an account?</Link>
              <Button className='w-full' type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterForm
