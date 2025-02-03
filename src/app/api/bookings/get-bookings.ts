'use server';
import { getServerSession } from 'next-auth';
import { db } from "@/lib/prisma";
import { AuthOptions } from "../../../../lib/authOptions";

export const getBookings = async () => {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authorized");
    }

    const userId = session.user.id;

    const bookings = await db.booking.findMany({
      where: { userId },
      orderBy: {
        date: 'asc',
      },
    });

    return bookings;
  } catch (error) {
    console.error('Error fetching bookings for user:', error);
    throw error;
  }
};
