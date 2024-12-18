import { db } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

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
                if (!credentials) return null;

                const user = await db.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) return null;

                const passwordCorrect = await compare(credentials.password, user.password);
                if (!passwordCorrect) {
                    console.log("Incorrect password");
                    return null;
                }

                return {
                    id: user.id,
                    role: user.role || "user",
                    email: user.email,
                };
            },
        }),
    ],

    callbacks: {
        jwt: async ({ user, token, trigger, session }) => {
            if (trigger === "update") {
                return { ...token, ...session.user };
            }
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        session: async ({ session, token }) => {
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
