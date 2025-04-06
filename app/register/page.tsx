"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { registerSchema, RegisterSchema } from "@/validation/userSchemas";
import { registerUser } from "@/actions";
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

export default function Register() {
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  async function onSubmit(values: RegisterSchema) {
    try {
      const user = await registerUser(values);
      console.log("User registered successfully:", user);
    } catch (error: any) {
      form.setError("root", {
        type: "manual",
        message: error.message || "An unexpected error occurred",
      });
    }
  }

  return (
    <main className="flex h-screen w-full items-center justify-center">
      {form.formState.isSubmitSuccessful ? (
        <Card className="w-[350px] space-y-4 p-6 shadow-md">
          <CardHeader>
            <CardTitle>Your account has been created</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Link href="/login">Login to your account</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-[350px] space-y-4 p-6 shadow-md">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Register for a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              {form.formState.errors.root && (
                <div className="text-red-500 text-sm mb-4">
                  {form.formState.errors.root.message}
                </div>
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
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
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
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
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
                  <Button type="submit" className="w-full">
                    Register
                  </Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
