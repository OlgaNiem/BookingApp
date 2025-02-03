'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getBookings } from '../api/bookings/get-bookings'; 
import { signOut } from 'next-auth/react';

interface Booking {
  id: string;
  activity: string;
  date: Date;
}
const BookingsPage = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getBookings(); 
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    loadBookings();
  }, []);

  const handleNewBooking = async () => {
    await getBookings(); 
    router.refresh();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl">My Bookings</h1>
        <div className="flex space-x-4">
          <Button asChild onClick={handleNewBooking}>
            <Link href={'/booking'}>Book Now</Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => signOut()} 
            className="w-full">
              Sign Out
          </Button>
        </div>
      </div>

      <div className="p-6 mt-4 border-[1px] rounded-md border-[E2E8F0]">
        <Table>
          {bookings.length ? (
            <>
              <TableHeader className="w-full">
                <TableRow className="w-full">
                  <TableHead className="w-[25%]">Activity</TableHead>
                  <TableHead className="w-[25%]">Date</TableHead>
                  <TableHead className="w-[25%]">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking: Booking) => (
                  <TableRow key={booking.id} className="cursor-pointer">
                    <TableCell>{booking.activity}</TableCell>
                    <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell>No bookings found.</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  );
};

export default BookingsPage;
