import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../../../../lib/authOptions';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  console.log("POST request received");

  const session = await getServerSession(AuthOptions);
  console.log("Session:", session);

  if (!session || !session.user) {
    console.log("Unauthorized access attempt");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("Request body:", body); 

    const { activity, date, email } = body;
      console.log(activity, date, email);
    if (!activity || !date || !email) {
      console.log("Missing required fields"); 
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        activity,
        date: date,
      },
    });

    console.log('Booking created:', booking);
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking.' }, { status: 500 });
  }
}
