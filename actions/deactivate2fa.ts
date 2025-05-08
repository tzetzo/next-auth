"use server";

import { users } from "@/db/userSchema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { authenticator } from "otplib";
import { auth } from "@/auth";

// Enable time synchronization in otplib by setting a tolerance window.
authenticator.options = { window: 1 }; // Allow a 1-step time drift (30 seconds by default)

export async function deactivate2FA(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("You must be logged in to perform this action.");
  }

  const email = session.user.email;

  await db
    .update(users)
    .set({ twoFactorActivated: false })
    .where(eq(users.email, email));

  return true;
}
