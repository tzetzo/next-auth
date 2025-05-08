"use server";

import { loginSchema, LoginSchema } from "@/validation/userSchemas";
import { signIn } from "@/auth";

export async function loginUser(data: LoginSchema) {
  // Validate the input using Zod
  const validatedData = loginSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.issues[0]?.message || "Invalid input");
  }

  try {
    // Call the signIn function from NextAuth
    const result = await signIn("credentials", {
      redirect: false,
      email: validatedData.data.email,
      password: validatedData.data.password,
      otp: validatedData.data.otp,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during login:", error);
      throw new Error("Login failed. Please try again.");
    }
  }
}
