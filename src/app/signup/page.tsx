"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const signUp = api.auth.signUp.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signUp.mutateAsync({ email, password, name });
      setSuccess(true);
      // Redirect to sign in page after 2 seconds
      setTimeout(() => {
        window.location.href = "/api/auth/signin";
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    }
  };

  if (success) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center gap-4 rounded-xl bg-white/10 p-8">
            <h1 className="text-3xl font-bold text-green-400">
              Account Created Successfully!
            </h1>
            <p className="text-lg">Redirecting to sign in...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Sign <span className="text-[hsl(280,100%,70%)]">Up</span>
        </h1>

        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-xl bg-white/10 p-8"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-lg bg-white/20 px-4 py-2 text-white placeholder-white/50 outline-none focus:bg-white/30"
                placeholder="John Doe"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg bg-white/20 px-4 py-2 text-white placeholder-white/50 outline-none focus:bg-white/30"
                placeholder="john@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="rounded-lg bg-white/20 px-4 py-2 text-white placeholder-white/50 outline-none focus:bg-white/30"
                placeholder="Min 8 characters"
              />
              <p className="text-xs text-white/70">
                Password must be at least 8 characters
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={signUp.isPending}
              className="mt-4 rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20 disabled:opacity-50"
            >
              {signUp.isPending ? "Creating Account..." : "Sign Up"}
            </button>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/api/auth/signin"
                className="text-[hsl(280,100%,70%)] underline hover:text-[hsl(280,100%,80%)]"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>

        <Link
          href="/"
          className="text-sm text-white/70 underline hover:text-white"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
