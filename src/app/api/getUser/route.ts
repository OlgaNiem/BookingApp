import { getServerSession } from 'next-auth';
import { AuthOptions } from '../../../../lib/authOptions';
import { NextResponse } from 'next/server';
export async function GET() {
    const session = await getServerSession(AuthOptions);
    if (!session) {
        return NextResponse.json({ error: 'Not authorised'}, {status: 400 })
    }
    return NextResponse.json({ succes: session}, {status: 200 })
}