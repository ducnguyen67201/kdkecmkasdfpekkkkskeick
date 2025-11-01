import { z } from "zod";
import { setCookie } from "cookies-next";
import bcrypt from "bcryptjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { verifyAuth0Token, getOrCreateAuth0User } from "~/server/auth0";
import { TRPCError } from "@trpc/server";

const AUTH0_COOKIE_NAME = "auth0_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const authRouter = createTRPCRouter({
  /**
   * Sign up with email and password
   */
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        name: z.string().min(1, "Name is required"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user already exists
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Create user
      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          name: input.name,
          password: hashedPassword,
          emailVerified: new Date(), // Auto-verify for now
        },
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    }),

  /**
   * Login with Auth0 token
   * Accepts an Auth0 JWT token, verifies it, saves to cookie, and creates/fetches user
   */
  login: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, "Token is required"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Verify the Auth0 token
      const auth0User = await verifyAuth0Token(input.token);

      if (!auth0User) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid Auth0 token",
        });
      }

      // Get or create user in database
      const user = await getOrCreateAuth0User(auth0User, ctx.db);

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }

      // Set Auth0 token in cookie
      // Note: In Next.js App Router with tRPC, we need to access headers differently
      // The cookie will be set on the response
      setCookie(AUTH0_COOKIE_NAME, input.token, {
        maxAge: COOKIE_MAX_AGE,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          tier: user.tier,
        },
      };
    }),

  /**
   * Logout - clear Auth0 token cookie
   */
  logout: publicProcedure.mutation(async () => {
    setCookie(AUTH0_COOKIE_NAME, "", {
      maxAge: 0,
      path: "/",
    });

    return { success: true };
  }),

  /**
   * Get current user from Auth0 token
   */
  me: publicProcedure.query(async ({ ctx }) => {
    // The auth0User will be set by middleware if token is valid
    if (!ctx.auth0User) {
      return null;
    }

    const user = await getOrCreateAuth0User(ctx.auth0User, ctx.db);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      tier: user.tier,
    };
  }),
});
