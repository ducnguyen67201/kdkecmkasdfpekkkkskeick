# Deployment Guide

## Database Migration Setup

This project uses automated database migrations that run when code is merged to the `main` branch.

### How It Works

When you merge a PR to `main` that includes changes to:
- `prisma/schema.prisma`
- `prisma/migrations/**`

The GitHub Actions workflow `.github/workflows/db-migrate.yml` will automatically:
1. Install dependencies
2. Run `prisma migrate deploy` to apply pending migrations to the production database

### Initial Setup

#### 1. Get Your Supabase Connection String

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/pilsjhkhdijtfdfqncum
2. Navigate to **Settings** → **Database**
3. Find **Connection string** → **URI** (NOT the pooler connection)
4. Copy the connection string. It should look like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

#### 2. Add DATABASE_URL to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `DATABASE_URL`
5. Value: Paste your Supabase connection string
6. Click **Add secret**

### Creating New Migrations

When you need to make database schema changes:

```bash
# 1. Update your schema in prisma/schema.prisma

# 2. Create a new migration (without applying it locally)
npx prisma migrate dev --name your_migration_name --create-only

# 3. Review the generated SQL in prisma/migrations/[timestamp]_your_migration_name/migration.sql

# 4. Commit the migration files
git add prisma/migrations/
git commit -m "Add migration: your_migration_name"

# 5. Push and create PR
git push

# 6. When merged to main, the migration will automatically apply to production
```

### Alternative: Quick Schema Changes (Development Only)

For rapid development without migration history:

```bash
# Push schema directly to database (skips migration files)
npm run db:push
```

⚠️ **Warning**: This should only be used in development. Production changes must use migrations.

### Viewing Your Database

```bash
# Open Prisma Studio to view/edit data
npm run db:studio
```

### Troubleshooting

**Migration fails in GitHub Actions:**
- Check that `DATABASE_URL` secret is set correctly
- Verify your Supabase database is accessible
- Check the Actions logs for specific error messages

**Local database out of sync:**
```bash
# Reset your local database and apply all migrations
npx prisma migrate reset

# Or just apply pending migrations
npx prisma migrate deploy
```

**Need to rollback a migration:**
Prisma doesn't support automatic rollbacks. You'll need to:
1. Create a new migration that reverses the changes
2. Or manually run SQL to revert (not recommended)

## Environment Variables

Make sure your `.env` file has the correct `DATABASE_URL`:

```bash
# For local development (your local PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/cyber_octopus"

# For Supabase (production)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
```

⚠️ **Never commit `.env` to git!** Use `.env.example` for documentation.
