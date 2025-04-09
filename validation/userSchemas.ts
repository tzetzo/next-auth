import { z } from "zod";

// Email validation schema
export const emailSchema = z.string().email("Invalid email address");

// Password validation schema
export const passwordSchema = z
  .string()
  .min(5, { message: "Password must be at least 5 characters." })
  .max(50, { message: "Password must not exceed 50 characters." });

// Full user registration schema
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords must match",
    path: ["passwordConfirm"], // This specifies where the error will appear
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

// Full user login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginSchema = z.infer<typeof loginSchema>;
