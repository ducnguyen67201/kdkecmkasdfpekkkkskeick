import { jwtVerify } from "jose";
import type { PrismaClient } from "@prisma/client";
import { env } from "~/env";

export interface Auth0User {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
}

/**
 * Verify Auth0 JWT token
 */
export async function verifyAuth0Token(
  token: string,
): Promise<Auth0User | null> {
  try {
    const secret = new TextEncoder().encode(env.AUTH0_CLIENT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      issuer: `https://${env.AUTH0_DOMAIN}/`,
      audience: env.AUTH0_AUDIENCE,
    });

    return {
      sub: payload.sub!,
      email: payload.email as string | undefined,
      name: payload.name as string | undefined,
      picture: payload.picture as string | undefined,
    };
  } catch (error) {
    console.error("Auth0 token verification failed:", error);
    return null;
  }
}

/**
 * Get or create user from Auth0 data
 */
export async function getOrCreateAuth0User(
  auth0User: Auth0User,
  db: PrismaClient,
) {
  // Check if user exists by email
  let user = await db.user.findUnique({
    where: { email: auth0User.email },
  });

  // Create user if doesn't exist
  if (!user && auth0User.email) {
    user = await db.user.create({
      data: {
        email: auth0User.email,
        name: auth0User.name,
        image: auth0User.picture,
        emailVerified: new Date(),
      },
    });
  }

  return user;
}
