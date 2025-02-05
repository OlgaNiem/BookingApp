import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../../../../lib/authOptions';
import { ObjectId } from 'mongodb'; 
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {

  const session = await getServerSession(AuthOptions);

  if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { activity, date } = body;

    if (!activity || !date) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format.' }, { status: 400 });
    }

    const userId = session.user.id;

    if (!ObjectId.isValid(userId)) {
      console.error("Invalid userId format");
      return NextResponse.json({ error: 'Invalid userId format' }, { status: 400 });
    }

    const userObjectId = new ObjectId(userId).toString();

    const booking = await prisma.booking.create({
      data: {
        userId: userObjectId,
        activity,
        date: bookingDate,
      },
    });

    return NextResponse.json({
      message: 'Booking created successfully!',
      booking: {
        activity: booking.activity,
        date: booking.date.toISOString(),
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking.' }, { status: 500 });
  }
}
