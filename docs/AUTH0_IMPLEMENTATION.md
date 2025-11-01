# Auth0 + tRPC Implementation Guide

## Overview

This implementation adds Auth0 authentication to your T3 app with custom tRPC endpoints and cookie-based session management.

## What Was Implemented

### 1. Tier Enum (Prisma Schema)

Added a `Tier` enum with three levels:
- `FREE` (default)
- `PRO`
- `ENTERPRISE`

Updated `User` model to use this enum instead of a String field.

**File:** `prisma/schema.prisma`

```prisma
enum Tier {
    FREE
    PRO
    ENTERPRISE
}

model User {
    // ... other fields
    tier Tier @default(FREE)
}
```

### 2. Auth0 Configuration

**Environment Variables:**
- `AUTH0_DOMAIN` - Your Auth0 domain
- `AUTH0_CLIENT_ID` - Your Auth0 application client ID
- `AUTH0_CLIENT_SECRET` - Your Auth0 application client secret
- `AUTH0_AUDIENCE` - Your Auth0 API audience

**Files Updated:**
- `.env.example`
- `.env`
- `src/env.js`

### 3. Auth0 Utilities

**File:** `src/server/auth0.ts`

Contains helper functions:
- `verifyAuth0Token()` - Verifies JWT tokens from Auth0
- `getOrCreateAuth0User()` - Gets existing user or creates new one from Auth0 data

### 4. tRPC Auth Router

**File:** `src/server/api/routers/auth.ts`

Three endpoints:

#### `auth.login`
```typescript
// Login with Auth0 token
const result = await trpc.auth.login.mutate({
  token: "your-auth0-jwt-token"
});

// Returns:
{
  success: true,
  user: {
    id: string,
    email: string,
    name: string,
    image: string,
    tier: "FREE" | "PRO" | "ENTERPRISE"
  }
}
```

#### `auth.logout`
```typescript
// Logout and clear cookie
await trpc.auth.logout.mutate();
```

#### `auth.me`
```typescript
// Get current authenticated user
const user = await trpc.auth.me.query();
// Returns user object or null if not authenticated
```

### 5. tRPC Middleware

**File:** `src/server/api/trpc.ts`

**Updated Context:**
- Automatically checks for `auth0_token` cookie on every request
- Verifies token and adds `auth0User` to context

**New Procedure:**
- `auth0Procedure` - Protected procedure that requires Auth0 authentication

Example usage:
```typescript
export const myRouter = createTRPCRouter({
  protectedEndpoint: auth0Procedure
    .query(async ({ ctx }) => {
      // ctx.auth0User is guaranteed to be available here
      console.log(ctx.auth0User.email);
      return { message: "Hello authenticated user!" };
    }),
});
```

## How to Use

### Setup Auth0

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new Application (Regular Web Application)
3. Get your credentials:
   - Domain
   - Client ID
   - Client Secret
4. Create an API in Auth0 and get the Audience
5. Update `.env` file with real values

### Client-Side Integration

```typescript
// After Auth0 login on frontend, you'll receive a JWT token
// Send it to your tRPC endpoint:

const loginUser = async (auth0Token: string) => {
  try {
    const result = await trpc.auth.login.mutate({
      token: auth0Token
    });

    console.log("Logged in:", result.user);
    // Cookie is automatically set by server
  } catch (error) {
    console.error("Login failed:", error);
  }
};
```

### Check Authentication

```typescript
// On any page, check if user is authenticated
const { data: user } = trpc.auth.me.useQuery();

if (user) {
  console.log(`Welcome ${user.name}! Your tier: ${user.tier}`);
}
```

### Use in Protected Routes

```typescript
// In your router files
export const protectedRouter = createTRPCRouter({
  getUserData: auth0Procedure
    .query(async ({ ctx }) => {
      // User is guaranteed to be authenticated via Auth0
      const user = await ctx.db.user.findUnique({
        where: { email: ctx.auth0User.email }
      });
      return user;
    }),
});
```

## Cookie Details

- **Name:** `auth0_token`
- **HttpOnly:** `true` (secure, not accessible via JavaScript)
- **Secure:** `true` in production
- **SameSite:** `lax`
- **Max Age:** 7 days
- **Path:** `/`

## Migration Notes

- Database schema was updated with `npm run db:push`
- No migration files created (using push for development)
- For production, use `npm run db:generate` to create migrations

## Testing

1. Server is running on: http://localhost:3001
2. Test the endpoints using your frontend or tools like Postman
3. Database is running in Docker on port 5432

## Security Considerations

1. **Token Verification:** All tokens are verified using Auth0's public key
2. **HttpOnly Cookies:** Prevents XSS attacks
3. **Secure Flag:** Enabled in production for HTTPS
4. **Environment Variables:** Validated on app start
5. **User Creation:** Only creates users with verified Auth0 tokens

## Next Steps

1. Replace placeholder Auth0 credentials in `.env`
2. Implement frontend Auth0 login flow
3. Use `auth0Procedure` for protected endpoints
4. Customize user tier logic as needed
5. Add tier-based authorization checks

## Files Created/Modified

### Created:
- `src/server/auth0.ts`
- `src/server/api/routers/auth.ts`
- `docs/AUTH0_IMPLEMENTATION.md`

### Modified:
- `prisma/schema.prisma`
- `src/env.js`
- `src/server/api/root.ts`
- `src/server/api/trpc.ts`
- `.env`
- `.env.example`
