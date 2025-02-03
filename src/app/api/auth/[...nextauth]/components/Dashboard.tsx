'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Session } from "next-auth"
import { useRouter } from 'next/navigation';

interface DashboardProps {
  session: Session | null; 
}
const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {session?.user ? (
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="flex flex-col items-center text-center space-y-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session.user.image || ''} alt={session.user.name || 'User'} />
              <AvatarFallback>{session.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-semibold text-grey-700">Welcome back</CardTitle>
            <CardDescription className="text-gray-600">{session.user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-700">
              Ready to book your next activity? Let’s get started!
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
          <Button
              onClick={() => router.push('/booking')} 
              className="w-full"
            >
              Book activity
            </Button>
            <Button variant="outline" onClick={() => signOut()} className="w-full">
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-gray-800 font-bold">You are not logged in</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Button
                variant="outline"
                onClick={() => router.push('/login')}
              >
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
