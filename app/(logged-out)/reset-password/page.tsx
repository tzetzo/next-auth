"use server";

import { users } from "@/db/userSchema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
// import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import ResetPasswordForm from "./reset-password-form";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/login"); // Redirect to login if no token is provided
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.resetPasswordToken, token))
    .limit(1);

  if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
    return (
      <main className="flex h-screen w-full items-center justify-center">
        <Card className="w-[350px] space-y-4 p-6 shadow-md">
          <CardHeader>
            <CardTitle>Invalid Token</CardTitle>
            <CardDescription>
              The reset token is invalid or has expired.
            </CardDescription>
            <CardContent>
              <Link href="/request-password-reset">
                Request another password reset link
              </Link>
            </CardContent>
          </CardHeader>
        </Card>
      </main>
    );
  }

  // Check if the token is expired
  if (new Date() > user.resetPasswordExpires) {
    return (
      <main className="flex h-screen w-full items-center justify-center">
        <Card className="w-[350px] space-y-4 p-6 shadow-md">
          <CardHeader>
            <CardTitle>Token Expired</CardTitle>
            <CardDescription>
              The reset token has expired. Please request a new one.
            </CardDescription>
            <CardContent>
              <Link href="/request-password-reset">
                Request another password reset link
              </Link>
            </CardContent>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex h-screen w-full items-center justify-center">
      <Card className="w-[350px] space-y-4 p-6 shadow-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm token={token || ""} />
        </CardContent>
      </Card>
    </main>
  );
}
