import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json(); 
        
        if (!email || !password || !name) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 

        await db.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        });

        return NextResponse.json({ success: 'Account created' }, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
