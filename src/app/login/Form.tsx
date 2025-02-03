'use client';

import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';

const formSchema = z.object({
  email: z
    .string()
    .min(4, { message: 'This field must be filled.' })
    .email('This is not a valid email')
    .max(50, { message: "Email can't be longer than 50 characters." }),
  password: z.string().min(4, { message: 'Password has to be at least 4 characters long' }),
});

interface LoginFormProps {
  session: Session | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ session }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();

  if (session) {
    router.push('/');
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (!response?.error) {
      toast.success('You are now signed in');
      router.push('/');
    } else {
      toast.error('Invalid email or password');
    }
  }

  return (
    <Card className="w-full my-10 max-w-md mx-auto shadow-lg p-6">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Login</CardTitle>
        <CardDescription className="text-center text-gray-600 mt-2">
          Sign in to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Write your email here..."
                      {...field}
                      value={field.value || ''}
                    />
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
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Link className='block text-sm text-center text-blue-500 hover:underline' href={'/register'}>
              Do not have an account?
            </Link>
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </Form>

        <div className="my-6 border-t pt-4">
          <p className="text-center text-sm text-gray-600">Or continue with</p>
          <div className="flex justify-center space-x-4 mt-4">
            <Button variant="outline" onClick={() => signIn('google')}>
              Sign in with Google
            </Button>
            <Button variant="outline" onClick={() => signIn('github')}>
              Sign in with GitHub
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
