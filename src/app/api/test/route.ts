import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await db.user.findMany({
      select: { email: true, name: true },
    });

    return new Response(JSON.stringify(users), {
      status: 200, 
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch data" }),
      { status: 500 }
    );
  }
}
