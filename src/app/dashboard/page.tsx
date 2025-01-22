import { getServerSession } from 'next-auth'
import React from 'react'
import { AuthOptions } from '../../../lib/authOptions'
import { redirect } from 'next/navigation';
import DashboardForm from './Form';

const  page = async () => {
    const session = await getServerSession(AuthOptions)
    const user = session?.user
    if (!session) {
        redirect('/login')
    }
    if (user?.role == 'admin') {
      redirect('/users')
    }
  return (
    
    <main className='max-w-7xl mx-auto my-12 space-y-5'>
        <h1 className='text-2xl font-semibold'>Welcome back, {user?.email}</h1>
        <DashboardForm email= {session?.user?.email as string}></DashboardForm>
    </main>
  );
};

export default page