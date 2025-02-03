import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getBookings } from '../api/bookings/get-bookings';

interface Booking {
  id: string;
  activity: string;
  date: Date;
}

const BookingsPage = async () => {

  const bookings = await getBookings();

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl">My Bookings</h1>
        <Button asChild>
          <Link href={'/booking'}>Book Now</Link>
        </Button>
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
                {bookings.map((booking: Booking) => {
                
                  return (
                    <TableRow key={booking.id} className="cursor-pointer">
                      <TableCell>{booking.activity}</TableCell>
                      <TableCell>{booking.date.toLocaleDateString()}</TableCell>
                      <TableCell>{booking.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>

                    </TableRow>
                  );
                })}
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
