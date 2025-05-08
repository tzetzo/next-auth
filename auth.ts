import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import db from "./db/drizzle";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { authenticator } from "otplib";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        otp: {},
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Invalid credentials");
        }

        const { email, password, otp } = credentials as {
          email: string;
          password: string;
          otp?: string;
        };

        // Check if the user exists
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!existingUser) {
          throw new Error("Invalid email or password.");
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await compare(
          password,
          existingUser.password as string
        );
        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }

        if (existingUser?.twoFactorActivated) {
          // Check if OTP is valid
          if (!otp) {
            throw new Error("OTP is required for two-factor authentication.");
          }
          const isValid = authenticator.check(
            otp,
            existingUser.twoFactorSecret as string
          );
          if (!isValid) {
            throw new Error("Invalid OTP. Please try again.");
          }
        }

        return {
          id: existingUser.id.toString(),
          email: existingUser.email,
        };
      },
    }),
  ],
  callbacks: {
    // usually not needed, here we are fixing a bug in next-auth
    // might not be needed in future versions of next-auth
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }: any) {
      // Add the user ID from the token to the session object
      if (session?.user && token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});
