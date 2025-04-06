"use server";

import { registerSchema, RegisterSchema } from "@/validation/userSchemas";
import { users } from "@/db/userSchema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";

export async function registerUser(data: RegisterSchema) {
  // Validate the input using Zod
  const validatedData = registerSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.issues[0]?.message || "Invalid input");
  }

  const { email, password } = validatedData.data;

  // Check if the email is already registered
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("Email is already registered.");
  }

  try {
    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Save the user to the database
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
      })
      .returning();

    // Exclude the password from the response
    const { password: _, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  } catch (error) {
    throw new Error("An error occurred while registering the user.");
  }
}
