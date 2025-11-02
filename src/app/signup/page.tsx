"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { OctoLabIcon } from "~/components/ui/octolab-icon";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { api } from "~/trpc/react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const signUp = api.auth.signUp.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError("");
      await signUp.mutateAsync(values);
      setSuccess(true);
      // Redirect to sign in page after 2 seconds
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mb-4 flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-green-600">
              Account Created Successfully!
            </h1>
            <p className="text-sm text-gray-600">
              Redirecting to sign in page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      {/* Logo in top-left */}
      <div className="fixed top-6 left-6 flex items-center gap-2">
        <OctoLabIcon className="h-8 w-8" />
        <span className="text-xl font-bold">OctoLab</span>
      </div>

      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <OctoLabIcon />
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold">Join OctoLab</h1>
            <p className="text-sm text-gray-600">
              Create your account to get started
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
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
                        placeholder="Min 8 characters"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error Message */}
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Sign Up Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={signUp.isPending}
              >
                {signUp.isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>

          {/* Already have account */}
          <div className="mt-6 flex items-center justify-center gap-1 text-sm">
            <span className="text-gray-600">Already have an account?</span>
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="h-4 w-4" />
          <span>
            Secured with enterprise-grade encryption and multi-factor
            authentication
          </span>
        </div>
      </div>
    </div>
  );
}
