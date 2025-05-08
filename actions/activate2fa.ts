"use server";

import { users } from "@/db/userSchema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { authenticator } from "otplib";
import { auth } from "@/auth";

// Enable time synchronization in otplib by setting a tolerance window.
authenticator.options = { window: 1 }; // Allow a 1-step time drift (30 seconds by default)

export async function activate2FA(otp: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("You must be logged in to perform this action.");
  }

  const email = session.user.email;

  const [user] = await db
    .select({ twoFactorSecret: users.twoFactorSecret })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user?.twoFactorSecret) {
    throw new Error("Two-factor authentication is not set up for this user.");
  }

  // Verify the OTP using the user's 2FA secret
  const isValid = authenticator.check(otp, user.twoFactorSecret);

  if (!isValid) {
    throw new Error("Invalid OTP. Please try again.");
  }

  await db
    .update(users)
    .set({ twoFactorActivated: true })
    .where(eq(users.email, email));

  return true;
}
