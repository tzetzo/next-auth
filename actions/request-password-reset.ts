"use server";

import {
  requestPasswordResetSchema,
  RequestPasswordResetSchema,
} from "@/validation/userSchemas";
import { users } from "@/db/userSchema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { hash, compare } from "bcryptjs";
import { auth } from "@/auth";
import { randomBytes } from "crypto";
import { transporter } from "@/lib/email";

export async function requestPasswordReset(
  data: RequestPasswordResetSchema
): Promise<{
  token: string;
  email: string;
} | void> {
  const session = await auth();
  if (session) {
    throw new Error("You are already logged in");
  }

  const validatedData = requestPasswordResetSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.issues[0]?.message || "Invalid input");
  }

  const { email } = validatedData.data;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) return;

  const resetPasswordToken = randomBytes(32).toString("hex");
  const resetPasswordTokenHash = await hash(resetPasswordToken, 10);
  const resetPasswordTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour from now
  await db
    .update(users)
    .set({
      resetPasswordToken: resetPasswordTokenHash,
      resetPasswordExpires: resetPasswordTokenExpiry,
    })
    .where(eq(users.email, email));

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetPasswordTokenHash}`;

  await transporter.sendMail({
    from: "test@resend.dev", // because we use the resend test email
    to: email, // we can only send emails to the same email with which we registered in resend.com
    subject: "Password Reset",
    html: `<p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>If you did not request this, please ignore this email.</p>`,
  });

  return {
    token: resetPasswordToken,
    email,
  }; // Return the token and email for testing purposes
}
