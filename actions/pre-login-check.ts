"use server";

import { users } from "@/db/userSchema";
import db from "@/db/drizzle";
import { loginSchema, LoginSchema } from "@/validation/userSchemas";
import { eq } from "drizzle-orm";
import { authenticator } from "otplib";
import { signIn } from "@/auth";
import { compare } from "bcryptjs";

export async function preLoginCheck(data: LoginSchema) {
  // Validate the input using Zod
  const validatedData = loginSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.issues[0]?.message || "Invalid input");
  }

  try {
    // Check if the user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.data.email))
      .limit(1);

    if (!existingUser) {
      throw new Error("Invalid email or password.");
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await compare(
      validatedData.data.password,
      existingUser.password as string
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    return {
      twoFactorActivated: existingUser.twoFactorActivated,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during login:", error);
      throw new Error("Login failed. Please try again.");
    }
  }
}
