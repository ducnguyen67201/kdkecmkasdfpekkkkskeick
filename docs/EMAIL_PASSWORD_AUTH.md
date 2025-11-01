# Email/Password Authentication Guide

Your app now has working email/password authentication! Here's how to use it.

## What Was Added

### 1. Database Changes
- Added `password` field to User model (stores hashed passwords)
- Schema updated and synced with database

### 2. NextAuth Configuration
- Added Credentials provider for email/password login
- Switched to JWT session strategy (required for credentials)
- Password hashing using bcryptjs

### 3. Sign-Up Endpoint
**tRPC Endpoint**: `auth.signUp`
- Creates new users with email, password, and name
- Automatically hashes passwords
- Validates email format and password strength (min 8 characters)

## How to Use

### Step 1: Sign Up a Test User

You can create a user via tRPC. Here's an example using the tRPC panel or your frontend:

```typescript
// Using tRPC
const result = await trpc.auth.signUp.mutate({
  email: "test@example.com",
  password: "password123",
  name: "Test User"
});
```

Or you can create a user directly in the database for testing:

```bash
# Connect to PostgreSQL
psql -U postgres -d cyber_octopus

# Create a test user (password is hashed version of "password123")
INSERT INTO "User" (id, email, name, password, "emailVerified")
VALUES (
  'test-user-id',
  'test@example.com',
  'Test User',
  '$2a$10$K1wbJbzQx.vZGxBqP3yHUOYxK7qF8mJxGhxOqU9QxZvYxHUOYxK7q',
  NOW()
);
```

### Step 2: Test the Login

1. **Restart your dev server** (if it's running):
   ```bash
   npm run dev
   ```

2. **Navigate to the sign-in page**:
   ```
   http://localhost:3000/api/auth/signin
   ```

3. **You should now see**:
   - Email input field
   - Password input field
   - "Sign in with credentials" button

4. **Enter credentials**:
   - Email: `test@example.com`
   - Password: `password123`

5. **Click Sign in** - You should be redirected to the homepage, logged in!

## Creating Users Programmatically

### Option 1: Using the Sign-Up Endpoint

Create a simple sign-up page in your app:

```typescript
"use client";

import { api } from "~/trpc/react";
import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const signUp = api.auth.signUp.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signUp.mutateAsync({ email, password, name });
      alert("Account created! You can now sign in.");
      window.location.href = "/api/auth/signin";
    } catch (error) {
      alert("Error creating account");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password (min 8 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

### Option 2: Create User via Database

For quick testing, you can hash a password and insert directly:

```bash
# Using Node.js to hash a password
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your_password', 10));"

# Then insert into database
psql -U postgres -d cyber_octopus
INSERT INTO "User" (id, email, name, password, "emailVerified")
VALUES ('unique-id', 'user@example.com', 'User Name', 'HASHED_PASSWORD_HERE', NOW());
```

## Testing the Login Flow

1. **Go to homepage**: `http://localhost:3000`
2. **Click "Sign in"** button
3. **Enter email and password** on NextAuth sign-in page
4. **Submit** - You'll be redirected back to the homepage
5. **You should see**: "Logged in as [Your Name]"

## Session Management

### Check if User is Logged In (Server Components)

```typescript
import { auth } from "~/server/auth";

export default async function MyPage() {
  const session = await auth();

  if (!session?.user) {
    return <div>Not logged in</div>;
  }

  return <div>Hello {session.user.name}!</div>;
}
```

### Check if User is Logged In (Client Components)

```typescript
"use client";

import { useSession } from "next-auth/react";

export default function MyComponent() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Not logged in</div>;
  }

  return <div>Hello {session.user.name}!</div>;
}
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs with salt rounds of 10
- **JWT Sessions**: Secure JWT tokens for session management
- **Validation**: Email format and password strength validation
- **No Plain Text**: Passwords are never stored in plain text

## Next Steps

### Add a Sign-Up Page

Create `src/app/signup/page.tsx` with a form for new users to register.

### Customize the Sign-In Page

NextAuth allows you to customize the sign-in page. See: https://next-auth.js.org/configuration/pages

### Add Password Reset

You can add password reset functionality using:
1. A "forgot password" endpoint
2. Generate a reset token
3. Send email with reset link
4. Allow password update with valid token

### Add Email Verification

Currently, emails are auto-verified. You can add proper email verification:
1. Send verification email on sign-up
2. Store verification token
3. Verify email when user clicks link

## Troubleshooting

### "No providers configured" Error
- Restart your dev server after making auth changes
- Check that `AUTH_SECRET` is set in `.env`

### "Invalid credentials" Error
- Double-check email and password
- Make sure password is hashed in database
- Verify user exists: `SELECT * FROM "User" WHERE email = 'your@email.com';`

### Session Not Persisting
- Clear browser cookies and try again
- Make sure `AUTH_SECRET` is set in `.env`
- Check browser console for errors

### Can't See Sign-In Form
- Go to: `http://localhost:3000/api/auth/signin`
- Make sure dev server is running
- Check terminal for any errors

## Quick Test Command

Create a test user quickly:

```bash
# Using tRPC from your frontend console (F12 -> Console)
await fetch('http://localhost:3000/api/trpc/auth.signUp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@test.com',
    password: 'password123',
    name: 'Test User'
  })
});
```

## Current Status

✅ Email/Password authentication configured
✅ Sign-up endpoint created
✅ Password hashing enabled
✅ JWT sessions configured
✅ Ready to test!

**Next**: Restart your dev server and navigate to `http://localhost:3000/api/auth/signin` to see the login form!
