import { AuthOptions } from "../../../../lib/authOptions";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/prisma"; 

export async function POST(request: Request) {
    const { email } = await request.json();
    try {
        const session = await getServerSession(AuthOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ success: 'Not authorised' }, { status: 400 });
        }

        const userEmail = session.user.email; 

        const user = await db.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            return NextResponse.json({ error: "User doesn't exist" }, { status: 400 });
        }

        await db.user.update({
            where: { email: userEmail },
            data: { email }
        });

        return NextResponse.json({ success: 'Email changed' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
