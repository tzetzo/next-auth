"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import Link from "next/link";
import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from "@/validation/userSchemas";
import { resetPassword } from "@/actions";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

export default function ResetPasswordForm({ token }: { token: string }) {
  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  const onSubmit = async (values: ResetPasswordSchema) => {
    try {
      await resetPassword(token, values);
      form.reset();
      toast.success("Password successfully reset", {
        description: "Your password has been reset",
        style: {
          backgroundColor: "green",
          color: "white",
        },
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
      form.setError("root", {
        message: err.message || "An unexpected error occurred",
      });
    }
  };

  return form.formState.isSubmitSuccessful ? (
    <div>
      Your password has been reset.{" "}
      <Link href="/login" className="underline">
        Login
      </Link>
    </div>
  ) : (
    <Form {...form}>
      {form.formState.errors.root && (
        <FormMessage>{form.formState.errors.root.message}</FormMessage>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <fieldset disabled={form.formState.isSubmitting} className="space-y-8">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPasswordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            Reset Password
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
