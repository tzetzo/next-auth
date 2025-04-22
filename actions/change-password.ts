"use server";

import {
  changePasswordSchema,
  ChangePasswordSchema,
} from "@/validation/userSchemas";
import { users } from "@/db/userSchema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { hash, compare } from "bcryptjs";
import { auth } from "@/auth"; // Import the `auth` function to get the session

export async function changePassword(data: ChangePasswordSchema) {
  console.log("data:", data);
  // Validate the input using Zod
  const validatedData = changePasswordSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.issues[0]?.message || "Invalid input");
  }

  const { currentPassword, newPassword } = validatedData.data;

  // Get the user's email from the session
  const session = await auth();
  if (!session || !session.user?.email) {
    throw new Error("You must be logged in to change your password");
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

  // Check if the current password is correct
  const isPasswordValid = await compare(currentPassword, currentUser.password);
  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  // Hash the new password
  const hashedNewPassword = await hash(newPassword, 10);

  // Update the user's password in the database
  await db
    .update(users)
    .set({ password: hashedNewPassword })
    .where(eq(users.id, currentUser.id));

  return { message: "Password changed successfully" };
}
