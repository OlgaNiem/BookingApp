import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ObjectId } from 'mongodb';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, activity, date, time } = body;

    if (!email || !activity || !date || !time) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const userId = new ObjectId(email); 

    
    const fullDateTime = new Date(`${date}T${time}:00`);

    const booking = await prisma.booking.create({
      data: {
        userId: userId.toHexString(), 
        activity,
        date: fullDateTime,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking.' }, { status: 500 });
  }
}
