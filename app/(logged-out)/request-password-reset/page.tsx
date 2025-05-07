"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  requestPasswordResetSchema,
  RequestPasswordResetSchema,
} from "@/validation/userSchemas";
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
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { requestPasswordReset } from "@/actions";

export default function RequestPasswordReset() {
  const searchParams = useSearchParams();

  const form = useForm<RequestPasswordResetSchema>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: decodeURIComponent(searchParams.get("email") || ""),
    },
  });

  async function onSubmit(values: RequestPasswordResetSchema) {
    try {
      await requestPasswordReset(values);
    } catch (error: unknown) {
      const err = error as { message?: string };
      form.setError("root", {
        message: err.message || "An unexpected error occurred",
      });
    }
  }

  return (
    <main className="flex h-screen w-full items-center justify-center">
      {form.formState.isSubmitSuccessful ? (
        <Card className="w-[350px] space-y-4 p-6 shadow-md">
          <CardHeader>
            <CardTitle>Email sent</CardTitle>
          </CardHeader>
          <CardContent>
            A password reset link has been sent to your email{" "}
            {form.getValues("email")}!
          </CardContent>
        </Card>
      ) : (
        <Card className="w-[350px] space-y-4 p-6 shadow-md">
          <CardHeader>
            <CardTitle>Password Reset</CardTitle>
            <CardDescription>
              Enter your email to reset your password
            </CardDescription>
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email@example.com"
                            {...field}
                            type="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="space-y-2 flex flex-col text-sm text-muted-foreground">
            <p>
              Remembered your password?{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}
