import { db } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "@prisma/client";

export const AuthOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email) return null;

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email },
            select: { id: true, email: true, password: true, role: true },
          });

          if (!user) return null;

          const passwordCorrect = await compare(credentials.password, user.password || "");
          if (!passwordCorrect) return null;

          return { id: user.id, role: user.role || "user", email: user.email };
        } catch (error) {
          console.error("Error during authorization", error);
          return null;
        }
      },
    }),
  ],
  adapter: PrismaAdapter(db),

  callbacks: {
    async signIn({ user, account }) {
      const email = user.email;
      if (!email) {
        console.error("OAuth user email is missing.");
        return false;
      }

      try {
        const existingUser = await db.user.findUnique({
          where: { email },
          select: { id: true, email: true },
        });

        if (existingUser && account) {
          const linkedAccount = await db.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: account.provider!,
              providerAccountId: account.providerAccountId!,
            },
          });

          if (!linkedAccount) {
            await db.account.create({
              data: {
                userId: existingUser.id,
                provider: account.provider!,
                providerAccountId: account.providerAccountId!,
                accessToken: account.access_token || "",
                refreshToken: account.refresh_token || "",
                providerType: account.type || "oauth",
              },
            });
          }
        } else if (!existingUser) {
          await db.user.create({
            data: {
              name: user.name || "",
              email,
              password: "",
              emailVerified: null,
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error during sign-in", error);
        return false;
      }
    },

    async jwt({ user, token }) {
      if (user) {
        token.id = user.id;
        token.role = (user as User).role || "user";
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        };
      }
      return session;
    },
  },
};
