import { DefaultSession, DefaultUser } from "next-auth";
import { User as PrismaUser } from "@prisma/client"; // Импортируем PrismaUser корректно

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      providerAccountId?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
