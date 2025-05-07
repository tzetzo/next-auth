import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

// Define the users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  email: text("email").notNull().unique(), // Email field with a max length of 255
  password: text("password").notNull(), // Password field
  resetPasswordToken: text("reset_password_token"), // Optional field for reset password token
  resetPasswordExpires: timestamp("reset_password_expires"), // Optional field for reset password expiration
  createdAt: timestamp("created_at").defaultNow().notNull(), // Timestamp with default value of now
  twoFactorSecret: text("two_factor_secret"), // Optional field for 2FA secret
  twoFactorActivated: boolean("two_factor_activated").default(false).notNull(), // Boolean for 2FA activation
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
