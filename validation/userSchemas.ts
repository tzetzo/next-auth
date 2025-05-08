import { z } from "zod";

// Email validation schema
export const emailSchema = z.string().email("Invalid email address");

// Password validation schema
export const passwordSchema = z
  .string()
  .min(5, { message: "Password must be at least 5 characters." })
  .max(50, { message: "Password must not exceed 50 characters." });

// OTP validation schema
export const otpSchema = z
  .string()
  .length(6, { message: "OTP must be exactly 6 characters." })
  .optional();

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
  otp: otpSchema,
});

export type LoginSchema = z.infer<typeof loginSchema>;

// Full user change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    newPasswordConfirm: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "Passwords must match",
    path: ["newPasswordConfirm"], // This specifies where the error will appear
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export const requestPasswordResetSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export type RequestPasswordResetSchema = z.infer<
  typeof requestPasswordResetSchema
>;

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    newPasswordConfirm: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "Passwords must match",
    path: ["newPasswordConfirm"],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
