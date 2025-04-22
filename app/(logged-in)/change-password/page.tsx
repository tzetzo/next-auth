"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  changePasswordSchema,
  ChangePasswordSchema,
} from "@/validation/userSchemas";
import { changePassword } from "@/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function ChangePasword() {
  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  async function onSubmit(values: ChangePasswordSchema) {
    try {
      const user = await changePassword(values);
      form.reset();
      toast.success("Password successfully changed", {
        description: "Your password has been updated",
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
  }

  return (
    <main className="flex h-screen w-full items-center justify-center">
      <Card className="w-[350px] space-y-4 p-6 shadow-md">
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Change your current password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {form.formState.errors.root && (
              <FormMessage>{form.formState.errors.root.message}</FormMessage>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <fieldset
                disabled={form.formState.isSubmitting}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
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
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
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
                  Change Password
                </Button>
              </fieldset>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
