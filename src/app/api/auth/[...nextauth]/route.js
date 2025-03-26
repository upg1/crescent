import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is not set');
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              scholarParent: {
                select: {
                  id: true,
                  parentId: true,
                  scholarId: true,
                  linkCode: true,
                  status: true,
                  expiresAt: true,
                  verifiedAt: true,
                  parent: {
                    select: {
                      id: true,
                      email: true,
                      name: true,
                      role: true,
                    },
                  },
                },
              },
              scholarChild: {
                select: {
                  id: true,
                  parentId: true,
                  scholarId: true,
                  linkCode: true,
                  status: true,
                  expiresAt: true,
                  verifiedAt: true,
                  scholar: {
                    select: {
                      id: true,
                      email: true,
                      name: true,
                      role: true,
                    },
                  },
                },
              },
              accessSettings: true,
              analytics: true,
              feedback: true,
              notes: true,
              progress: true,
            },
          });

          if (!user || !user?.password) {
            return null;
          }

          const isCorrectPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isCorrectPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            scholarParent: user.scholarParent,
            scholarChild: user.scholarChild,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    // Removed signOut: "/auth/signout"
  },
  callbacks: {
    async signIn({ user }) {
      return !!user;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.scholarParent = user.scholarParent;
        token.scholarChild = user.scholarChild;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.scholarParent = token.scholarParent;
        session.user.scholarChild = token.scholarChild;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };