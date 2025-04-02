"use server";

import { registerSchema, RegisterSchema } from "@/validation/userSchemas";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";

// const prisma = new PrismaClient();

export async function registerUser(data: RegisterSchema) {
  // Validate the input using Zod
  const validatedData = registerSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0]?.message || "Invalid input",
    };
  }

  // Check if the email is already registered
  //   const existingUser = await prisma.user.findUnique({
  //     where: { email: validatedData.email },
  //   });
  //   if (existingUser) {
  //     throw new Error("Email is already registered.");
  //   }

  // Hash the password
  //   const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  //   // Save the user to the database
  //   const newUser = await prisma.user.create({
  //     data: {
  //       email: validatedData.email,
  //       password: hashedPassword,
  //     },
  //   });

  //   return newUser;
}
