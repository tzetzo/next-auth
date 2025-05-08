"use server";

import db from "@/db/drizzle";
import { users } from "@/db/userSchema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { authenticator } from "otplib";

export async function get2FAsecret() {
  const session = await auth();
  if (!session || !session.user?.email) {
    throw new Error(
      "You must be logged in to enable two-factor authentication"
    );
  }

  const email = session.user.email;

  // Find the user in the database
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user.length) {
    throw new Error("User not found");
  }

  const currentUser = user[0];

  let secret = currentUser.twoFactorSecret;

  if (!secret) {
    secret = authenticator.generateSecret();
    await db
      .update(users)
      .set({ twoFactorSecret: secret })
      .where(eq(users.id, currentUser.id));
  }

  return { secret: authenticator.keyuri(email, "next-auth", secret) };
}
