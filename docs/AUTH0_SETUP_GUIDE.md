# Auth0 Setup Guide - Username/Password + Google Login

This guide will help you configure Auth0 to enable both **username/password** and **Google** login options using Auth0's Universal Login.

## Overview

Your app now uses **NextAuth.js** with the **Auth0 provider**. This means:
- Users will see Auth0's Universal Login page when they click "Sign in"
- Auth0 handles all authentication (username/password, Google, etc.)
- NextAuth manages the session after successful login

## Step 1: Create Auth0 Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Click **Applications** → **Applications** in the sidebar
3. Click **Create Application**
4. Choose:
   - **Name**: `Cyber Octopus` (or your app name)
   - **Application Type**: `Regular Web Application`
5. Click **Create**

## Step 2: Configure Application Settings

1. Go to your application's **Settings** tab
2. Scroll down to **Application URIs**
3. Set the following:

   ```
   Allowed Callback URLs:
   http://localhost:3000/api/auth/callback/auth0
   http://localhost:3002/api/auth/callback/auth0

   (Add production URL when deploying):
   https://yourdomain.com/api/auth/callback/auth0

   Allowed Logout URLs:
   http://localhost:3000
   http://localhost:3002
   https://yourdomain.com

   Allowed Web Origins:
   http://localhost:3000
   http://localhost:3002
   https://yourdomain.com
   ```

4. Click **Save Changes** at the bottom

## Step 3: Get Your Credentials

In the same **Settings** tab, copy these values to your `.env` file:

```bash
# Your Auth0 Domain (e.g., dev-abc123.us.auth0.com)
AUTH0_DOMAIN="your-domain.auth0.com"

# Your Application's Client ID
AUTH0_CLIENT_ID="your_client_id_here"

# Your Application's Client Secret (click "Show" to reveal)
AUTH0_CLIENT_SECRET="your_client_secret_here"

# Your Auth0 Audience (we'll create this in Step 5)
AUTH0_AUDIENCE="https://your-domain.auth0.com/api/v2/"
```

## Step 4: Enable Username/Password Authentication

1. In Auth0 Dashboard, go to **Authentication** → **Database** in the sidebar
2. You should see a default database connection called `Username-Password-Authentication`
3. Click on it to configure:
   - **Requires Username**: Toggle ON if you want usernames (or keep OFF for email-only)
   - **Requires Email**: Should be ON
4. Click **Save**

5. Go to the **Applications** tab within the database connection
6. Make sure your application is enabled (toggle should be ON)

## Step 5: Enable Google Login

1. Go to **Authentication** → **Social** in the sidebar
2. Click **+ Create Connection**
3. Select **Google**
4. You have two options:

### Option A: Use Auth0's Developer Keys (Quick Testing Only)
- Toggle **Use Auth0's developer keys** to ON
- This is only for testing, has rate limits
- Click **Save**

### Option B: Use Your Own Google OAuth Keys (Recommended for Production)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Set **Authorized redirect URIs**:
   ```
   https://your-domain.auth0.com/login/callback
   ```
   (Replace `your-domain` with your AUTH0_DOMAIN)
7. Copy the **Client ID** and **Client Secret**
8. Back in Auth0, enter these in the Google connection settings
9. Click **Save**

10. Go to the **Applications** tab within the Google connection
11. Enable your application (toggle ON)

## Step 6: Configure Universal Login

1. Go to **Branding** → **Universal Login** in Auth0 dashboard
2. Choose your preferred experience:
   - **New Universal Login** (Recommended - modern UI)
   - **Classic Universal Login**
3. Click **Save**

## Step 7: Test Login Flow

1. Make sure your Next.js app is running:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000` (or your port)

3. Click **Sign in**

4. You should see Auth0's Universal Login with:
   - **Continue with Google** button
   - Email/Password input fields
   - **Sign Up** link

5. Try both login methods:
   - Sign up with email/password
   - Login with Google

## How It Works

### Login Flow:
1. User clicks "Sign in" on your app
2. User is redirected to Auth0's Universal Login page
3. User can choose:
   - Continue with Google
   - Sign up with email/password
   - Log in with email/password
4. After successful authentication, Auth0 redirects back to your app
5. NextAuth creates a session and stores it in a cookie
6. User is now logged in

### Session Management:
- NextAuth handles all session management
- Session data is stored in your PostgreSQL database (via Prisma)
- You can access user info with `const session = await auth()` in server components
- Or use `useSession()` hook in client components

## Customization Options

### Add More Social Providers
You can add more providers like GitHub, Facebook, Twitter, etc.:
1. Go to **Authentication** → **Social**
2. Click **+ Create Connection**
3. Choose provider and follow similar steps as Google

### Customize Login Screen
1. Go to **Branding** → **Universal Login**
2. Click **Advanced Options** tab
3. Customize colors, logo, fonts, etc.

### Add Tier Field to User Profile
Your schema has a `tier` field (FREE, PRO, ENTERPRISE). To set this during signup:

1. Go to **Auth Flow** → **Actions** → **Flows**
2. Click on **Login**
3. Click **+** to add custom action
4. Add code to set user metadata based on your business logic

## Troubleshooting

### "Callback URL mismatch" Error
- Double-check the **Allowed Callback URLs** in Auth0 application settings
- Make sure it matches exactly: `http://localhost:3000/api/auth/callback/auth0`

### Google Login Not Showing
- Make sure Google connection is enabled for your application
- Check that the Google connection is turned ON in Authentication → Social

### Session Not Persisting
- Make sure `AUTH_SECRET` is set in your `.env` file
- Generate one with: `npx auth secret`

### Database Connection Error
- Make sure PostgreSQL is running
- Check `DATABASE_URL` in `.env` file
- Run `npm run db:push` to ensure schema is synced

## Security Best Practices

1. **Never commit** `.env` file to version control
2. Use **different Auth0 applications** for development and production
3. Enable **Multifactor Authentication** in Auth0 for production
4. Set **session expiration** appropriate for your app's security needs
5. Use **HTTPS** in production (required for secure cookies)

## Next Steps

- [ ] Replace Auth0 developer credentials with production credentials
- [ ] Add Google OAuth credentials (if using production)
- [ ] Customize Auth0 Universal Login branding
- [ ] Test both username/password and Google login
- [ ] Set up password reset flow (handled automatically by Auth0)
- [ ] Configure email templates in Auth0 for verification emails

## Resources

- [Auth0 Dashboard](https://manage.auth0.com/)
- [NextAuth.js Auth0 Provider Docs](https://next-auth.js.org/providers/auth0)
- [Auth0 Universal Login Docs](https://auth0.com/docs/authenticate/login/auth0-universal-login)
- [Google OAuth Setup](https://support.google.com/cloud/answer/6158849)
