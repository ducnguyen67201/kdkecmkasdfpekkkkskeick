# Type Checking Guide

## Quick Reference

Fast TypeScript type checking without running builds.

### Basic Usage

```bash
# Check all TypeScript files
npm run type-check

# Check specific files
npm run type-check -- src/app/signin/page.tsx

# Check specific directories
npm run type-check -- src/components src/utils

# Check multiple files
npm run type-check -- src/app/page.tsx src/app/layout.tsx
```

### Advanced Options

```bash
# Show only first N errors (requires workaround - see below)
npm run type-check 2>&1 | head -n 50

# Watch mode (re-check on file changes)
npx tsc --noEmit --watch

# Check specific file with all related files
npm run type-check -- --project tsconfig.json src/app/signin/page.tsx

# Generate trace for debugging slow type checks
npx tsc --noEmit --generateTrace trace --incremental false
```

## Key Features

- **Fast**: ~15-20 seconds vs minutes for full build
- **Incremental**: Caches results for faster subsequent runs (when using --incremental)
- **Flexible**: Check entire app, specific files, or directories
- **No Side Effects**: Doesn't generate build artifacts

## When to Use

- **Before committing**: Ensure no type errors in your changes
- **During development**: Quick validation without waiting for build
- **Debugging type issues**: Check specific files with all error details
- **CI/PR checks**: Fast type validation in pipelines

## Common Scenarios

### 1. Before Committing Changes

```bash
# Quick check of all files
npm run type-check

# If there are many errors, check only your changed files
npm run type-check -- src/app/signin/page.tsx
```

### 2. Debugging Type Errors

```bash
# Check specific file to see all errors
npm run type-check -- src/app/signin/page.tsx

# Check related files
npm run type-check -- src/app src/components
```

### 3. CI/CD Integration

The type check runs automatically in GitHub Actions when you push to main or create a PR.

See `.github/workflows/ci.yml` for configuration.

### 4. Limiting Output

Since TypeScript doesn't have a built-in `--max-errors` flag for `tsc --noEmit`, you can use shell commands:

```bash
# Show only first 50 lines of output
npm run type-check 2>&1 | head -n 50

# Show only first 100 lines
npm run type-check 2>&1 | head -n 100

# Filter for specific errors
npm run type-check 2>&1 | grep "TS2322"
```

## Understanding Type Errors

When you see errors like:

```
src/app/signin/page.tsx(37,5): error TS2322: Type 'X' is not assignable to type 'Y'
```

- `src/app/signin/page.tsx(37,5)` - File path and location (line 37, column 5)
- `TS2322` - Error code (you can search this online)
- Description explains what's wrong

## Tips

1. **Fix errors incrementally**: Don't try to fix all errors at once
2. **Use VSCode**: Hover over red squiggles for inline error messages
3. **Check one file at a time**: `npm run type-check -- <file>` for faster feedback
4. **Read error messages carefully**: TypeScript errors can be verbose but informative
5. **Use type assertions sparingly**: Fix the root cause instead of using `as any`

## Troubleshooting

### "Cannot find module" errors

```bash
# Regenerate Prisma Client
npx prisma generate

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
npm ci
```

### Slow type checking

```bash
# Use incremental mode (creates .tsbuildinfo cache file)
npx tsc --noEmit --incremental

# Check specific files instead of entire project
npm run type-check -- src/app
```

### Out of memory errors

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run type-check
```

## Scripts in package.json

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",      // Check types without emitting files
    "typecheck": "tsc --noEmit",       // Alias for backwards compatibility
    "check": "next lint && tsc --noEmit"  // Run both linting and type checking
  }
}
```

## Integration with Other Tools

### With ESLint

```bash
# Run both linting and type checking
npm run check
```

### With Prettier

```bash
# Format, lint, and type check
npm run format:write && npm run lint:fix && npm run type-check
```

### Pre-commit Hook (Recommended)

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
npm run format:check
npm run lint
npm run type-check
```

## Additional Resources

- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [TypeScript Error Reference](https://typescript.tv/errors/)
- [Next.js TypeScript](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
