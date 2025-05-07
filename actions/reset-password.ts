"use server";

import { users } from "@/db/userSchema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { hash, compare } from "bcryptjs";
import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from "@/validation/userSchemas";

export async function resetPassword(token: string, data: ResetPasswordSchema) {
  const validatedData = resetPasswordSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.issues[0]?.message || "Invalid input");
  }

  const { newPassword } = data;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.resetPasswordToken, token))
    .limit(1);

  if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
    throw new Error("Invalid or expired reset token.");
  }

  if (new Date() > user.resetPasswordExpires) {
    throw new Error("Reset token has expired.");
  }

  const isTokenValid = token === user.resetPasswordToken;
  if (!isTokenValid) {
    throw new Error("Invalid reset token.");
  }

  const hashedPassword = await hash(newPassword, 10);

  await db
    .update(users)
    .set({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    })
    .where(eq(users.id, user.id));

  return { message: "Password reset successfully." };
}
