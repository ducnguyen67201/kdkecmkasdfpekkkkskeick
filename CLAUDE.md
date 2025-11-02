
### 📋 Creating New Documentation

**IMPORTANT: Before creating any new product specs or engineering specs, ALWAYS search for existing documentation:**

1. **Search for related PRDs/specs** in:
   - `/docs/` - Technical documentation and engineering specs
   - `/product-specs/` - Product requirement documents
   - `/docs/engineering-specs/` - Detailed engineering specifications
   - App-specific docs folders (e.g., `/apps/evals-web/docs/`)

2. **Use search commands** to find prior work:
   ```bash
   # Search for existing specs on a feature
   grep -r "feature-name" docs/ product-specs/ --include="*.md"
   
   # Search for engineering patterns
   grep -r "pattern-name" docs/engineering-specs/ --include="*.md"
   
   # Find all PRDs
   find . -name "PRD-*.md" -o -name "*-spec.md" -o -name "*-design.md"
   ```

3. **Reference and build upon existing work**:
   - Link to related documents using wiki-style links
   - Mention superseded documents if replacing old specs
   - Include a "Related Documentation" section in new specs

4. **Common existing documentation patterns**:
   - Feature specs: `/docs/[feature-name]/design.md`, `spec.md`, `requirements.md`
   - Engineering specs: `/docs/engineering-specs/[feature]-specification.md`
   - PRDs: `/docs/PRD-[feature-name].md`
   - Migration guides: `/docs/[feature]-migration-guide.md`
   - Task tracking: `/docs/[feature-name]/tasks.md`
   - Implementation plans: `/docs/[feature-name]/implementation-plan.md`

## 📝 Pro Tips for Documentation & Task Management

### When Creating Requirements Documents

**Format for Requirements:**
```markdown
# [Feature] Requirements

## Overview
Brief description of what we're building and why.

## Options Analysis
### Option 1: [Name]
- **Description**: What this approach entails
- **Pros**: Benefits of this approach
- **Cons**: Drawbacks or limitations
- **Effort**: Estimated complexity (Low/Medium/High)

### Option 2: [Name]
...

## Recommended Approach
Clear recommendation with justification.

## Success Criteria
- [ ] Measurable outcome 1
- [ ] Measurable outcome 2
```

### When Creating Task Documents

**Format for Task Tracking:**
```markdown
# [Feature] Implementation Tasks

## 📊 Progress Summary
### Completed Tasks ✅ (X of Y total)
1. **Task Name** (Task ID): Brief description
2. ...

### Current Focus 🚧
- Active task description

### Overall Progress: X% Complete

## Phase 1: [Phase Name]
### Week 1: [Focus Area]
#### Day 1-2: [Sub-area]
- [x] **Task 1.1**: Task description ✅ COMPLETED
  - File: `path/to/file.ts`
  - ✅ What was accomplished
  - ✅ Specific changes made
  - See: `/docs/related-doc.md` for details

- [ ] **Task 1.2**: Pending task
  - File: `path/to/file.ts`
  - What needs to be done
  - Dependencies or blockers
```

### When Creating Specifications

**Format for Technical Specifications:**
```markdown
# [Feature] Technical Specification

## Architecture Overview
High-level architecture with Mermaid diagrams.

## Implementation Details
### Component 1
- **Purpose**: What it does
- **Location**: `path/to/component`
- **Dependencies**: What it needs
- **Interface**: API/contract definition

## Database Schema
```prisma
model Example {
  id String @id
  // schema definition
}
```

## API Endpoints
### POST /api/endpoint
**Request:**
```json
{ "field": "value" }
```
**Response:**
```json
{ "result": "data" }
```

## Error Handling
- Error scenarios and responses
- Retry strategies
- Fallback behaviors
```

### 🎯 CRITICAL: Best Practices for Progress Updates

**ALWAYS update tasks.md as you work:**

1. **Real-time task updates are ESSENTIAL**:
   ```markdown
   # After completing EACH task, immediately update tasks.md:
   - Change [ ] to [x] 
   - Add ✅ COMPLETED marker
   - Document what was actually done
   - Note any deviations from the plan
   
   # Example commit pattern:
   1. Complete the implementation
   2. Update tasks.md to mark task complete
   3. Commit both together
   ```

2. **Use TodoWrite tool AND update tasks.md**:
   ```typescript
   // Use TodoWrite for tracking during the session
   TodoWrite([
     { content: "Implement token validation", status: "completed", id: "1" }
   ])
   
   // THEN immediately update the tasks.md file:
   // - [x] **Task 1.2**: Add JWT token validation ✅ COMPLETED
   ```

3. **Document as you go, not after**:
   - Update tasks.md IMMEDIATELY after completing each task
   - Don't wait until the end of a session
   - Include what files were modified
   - Note any issues encountered and how they were resolved

### 🤔 CRITICAL: Be a Socratic Planner

**Act as a Socratic planner to ensure complete understanding before writing any plans or specifications:**

1. **ALWAYS ask clarifying questions BEFORE writing**:
   ```markdown
   Before I create the [plan/PRD/spec], I need to understand:
   
   1. Who is the target audience for this feature?
   2. What problem are we trying to solve?
   3. Are there any technical constraints I should know about?
   4. What's the expected timeline?
   5. Are there existing patterns we should follow?
   6. What are the success metrics?
   ```

2. **Common questions to ask for different documents**:

   **For PRDs:**
   - What user problem are we solving?
   - Who are the stakeholders?
   - What are the must-have vs nice-to-have features?
   - What are the non-functional requirements (performance, scale)?

   **For Technical Specs:**
   - What's the current system architecture?
   - Are there preferred technologies or patterns?
   - What are the performance requirements?
   - How should we handle errors and edge cases?
   - What are the security considerations?

   **For Task Plans:**
   - Who will be working on this?
   - What's the priority order for tasks?
   - Should we break this into phases?

3. **Don't assume - always confirm**:
   - "Based on the codebase, it looks like we typically use X pattern. Should I follow that here?"
   - "I notice there's an existing Y feature. Should this integrate with it?"
   - "The current implementation uses Z. Should we maintain compatibility?"

4. **Get specific about requirements**:
   - Instead of assuming, ask: "Should this support multiple concurrent users?"
   - Instead of guessing, confirm: "What should happen when X fails?"
   - Instead of choosing, inquire: "Should we optimize for speed or memory usage?"

### Documentation Naming Conventions

**Consistency is key:**
- Requirements: `requirements.md` or `[feature]-requirements.md`
- Tasks: `tasks.md` or `implementation-tasks.md`
- Specifications: `technical-specification.md` or `[feature]-spec.md`
- Design docs: `design.md` or `architecture.md`
- Rejected options: `rejected-options-appendix.md`
- Approach docs: `[feature]-approach.md`

### Linking Documents

**Use wiki-style links for navigation:**
```markdown
- See: [[/docs/livekit-to-livekit/requirements|Requirements Document]]
- Related: [[/docs/livekit-to-livekit/tasks|Implementation Tasks]]
- Specification: [[/docs/livekit-to-livekit/technical-specification|Technical Spec]]
```

---

5. **Citation Requirements for Technical Documentation**:
   
   When creating requirements documents, technical plans, or research findings, **ALWAYS include clear citations**:
   
   - **Code References**: Include file paths and line numbers (e.g., `/apps/livekit-worker/telephony/call_handler.py:245`)
   - **External Documentation**: Link to official docs with descriptive text (e.g., [Daily Python SDK](https://docs.daily.co/reference/daily-python))
   - **API References**: Include versioned links when possible (e.g., [Pipecat v0.0.65 Transport API](https://docs.pipecat.ai/api-reference/transports))
   - **GitHub Sources**: Link to specific files, commits, or PRs (e.g., [source](https://github.com/pipecat-ai/pipecat/blob/main/src/pipecat/transports/daily.py))
   - **Inline Citations**: Use footnotes [^1] for detailed references at document end
   - **Tables and Comparisons**: Source each data point (e.g., "Source: LiveKit Protocol Docs")
   
   **Example Citation Formats**:
   ```markdown
   # Good Citation Examples
   
   - The VAD implementation uses Silero ([docs](https://docs.pipecat.ai/api-reference/processors/audio/vad))
   - Turn detection timeout is 3 seconds (see `/apps/livekit-worker/telephony/turn_detector/base.py:89`)
   - Daily supports 16-bit PCM audio format ([audio guide](https://docs.daily.co/guides/custom-audio))
   - Pattern from [Pipecat transport examples](https://github.com/pipecat-ai/pipecat/tree/main/examples)
   
   # References Section
   [^1]: Pipecat Transport Architecture - [GitHub Source](https://github.com/pipecat-ai/pipecat/tree/main/src/pipecat/transports)
   ```
   
   This ensures all technical decisions and recommendations are traceable and verifiable.

### Type Checking

Fast TypeScript type checking without running builds:

#### Quick Type Checking Commands

```bash
# Check all TypeScript files in the current app
cd apps/evals-web
npm run type-check                    # Shows all errors

# Limit error output for faster feedback
npm run type-check -- --max-errors=5  # Show first 5 errors only

# Check specific files or directories
npm run type-check -- src/components/Button.tsx
npm run type-check -- src/components src/utils
npm run type-check -- file1.ts file2.ts src/hooks/

# From project root
npm run type-check:web                # Check evals-web
npm run type-check:queue              # Check evals-queue
```

#### Quick Tests Commands

Always run tests in CI=true mode. We always use vitest for testing Node / TypeScript. All test files end with `.spec.ts`.

```bash
# Run all tests
CI=true doppler run -- npm run test (for web)
CI=true doppler run -- npm run test:unit (for queue)
```

Never use `as any` for type casting. Instead, use type guards or type assertions. Using as unknown as <X> is better than using `as any` in test files.

### OpenAPI Generation and SDK Management

#### Automatic Generation via GitHub Actions (Primary Method)

When you modify API routers, OpenAPI specs and SDKs are automatically updated through separate workflows:

**REST API Generation** (`.github/workflows/generate-openapi-spec-rest.yaml`)

**Triggers:**
- Changes to REST API routers: `apps/evals-web/src/server/rest/routers/**`
- Manual trigger via workflow dispatch

**Process:**
1. Builds required packages (types, tracing)
2. Generates REST API OpenAPI specifications
3. Detects changes and bumps SDK version (patch increment)
4. Creates a PR with branch name `update-rest-openapi-specs-{timestamp}`

**ISC API Generation** (`.github/workflows/generate-openapi-spec-isc.yaml`)

**Triggers:**
- Changes to ISC API routers: `apps/evals-web/src/server/isc/routers/**`
- Manual trigger via workflow dispatch

**Process:**
1. Builds required packages (types, tracing, isc-client)
2. Generates ISC API OpenAPI specification
3. Creates a PR with branch name `update-isc-openapi-specs-{timestamp}`

**SDK Release** (`.github/workflows/release-sdk.yaml`)

**Triggers:**
- When PR with branch name `update-rest-openapi-specs-*` is merged to main
- Manual trigger via workflow dispatch

**Process:**
1. Builds and tests Node.js SDK
2. Builds and tests Python SDK
3. Uploads both SDKs to S3 for distribution
4. Creates release summary in GitHub Actions

This approach ensures all API changes are reviewed before SDK release, with separate workflows for REST and ISC APIs.

#### Manual Generation (Local Development)

For local development and testing:

```bash
# From evals-web directory
cd apps/evals-web

# Generate both REST and ISC OpenAPI specs (default)
doppler run --project web --config dev_personal -- npm run generate:openapi

# Generate only REST API spec
doppler run --project web --config dev_personal -- npm run generate:openapi -- --rest

# Generate only ISC API spec  
doppler run --project web --config dev_personal -- npm run generate:openapi -- --isc

# Or use the shorthand npm scripts
doppler run --project web --config dev_personal -- npm run generate:openapi:rest
doppler run --project web --config dev_personal -- npm run generate:openapi:isc
```

The script:
- Uses commander.js for command-line argument parsing
- Starts a Next.js dev server on port 3999
- Waits for server readiness (with retries)
- Fetches OpenAPI specs using your Doppler-configured API key
- Updates the appropriate locations based on options:
  - REST API: `packages/hamming-sdk/src/openapi/openapi.json` (SDK source) and `apps/mintlify/openapi/rest/openapi.json` (Documentation)
  - ISC API: `packages/isc-client/src/openapi/openapi.json` (ISC client)
  - Both: All three locations (default behavior)
- Automatically shuts down the server

#### SDK Version Management

The SDK version is managed in `packages/hamming-sdk/package.json` and automatically bumped when API changes are detected.

**Manual version bump:**
```bash
cd packages/hamming-sdk
npm run bump-version patch  # or minor/major
```

The bump script:
- Updates only the root package.json (Node.js package handled separately)
- Preserves exact JSON formatting
- Supports patch, minor, and major version increments

#### SDK Release Process

**Full release (both SDKs):**
```bash
cd packages/hamming-sdk

# Release Node.js SDK
doppler run --project web --config stage_aws -- npm run release:nodejs

# Release Python SDK  
doppler run --project web --config stage_aws -- npm run release:python
```

**What each release does:**
1. Cleans previous build artifacts
2. Validates the OpenAPI specification
3. Generates SDK code using OpenAPI Generator
4. Builds the SDK package
5. Runs comprehensive test suite
6. Uploads to S3 bucket for distribution

**Required Environment Variables (via Doppler):**
- `SWAGGER_TOKEN` - API authentication
- `AWS_ACCESS_KEY_ID` - S3 upload access
- `AWS_SECRET_ACCESS_KEY` - S3 upload credentials
- `SDK_BUCKET` - Target S3 bucket (default: "hamming-sdk")

#### Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3999
lsof -ti:3999 | xargs kill -9
```

**Python test failures:**
Ensure pytest is installed: `pip install pytest pytest-cov`

**S3 upload failures:**
Check AWS credentials have proper S3 write permissions for the SDK bucket.


### Adding Tests

Read this file .cursor/rules/unit-testing-best-practices.mdc for adding high quality unit tests.

#### Key Features

- **Fast**: ~15-20 seconds vs minutes for full build
- **Incremental**: Caches results for faster subsequent runs
- **Flexible**: Check entire app, specific files, or directories
- **No Side Effects**: Doesn't generate build artifacts

#### When to Use

- **Before committing**: Ensure no type errors in your changes
- **During development**: Quick validation without waiting for build
- **Debugging type issues**: Check specific files with all error details
- **CI/PR checks**: Fast type validation in pipelines

See [[/docs/type-checking-usage|Type Checking Usage Guide]] for detailed documentation.

### Deployment

- [[/wiki/deployment-process|Deployment Strategy]]
- [[/infra/porter/staging/README|Staging Environment]]
- [[/infra/porter/prod/README|Production Environment]]

### Dependency Drift Detection System

System for detecting underlying dependency changes not visible in package.json/lock files.

#### Overview
Detects system-level dependency drift between production and main branch by capturing and comparing system manifests. This catches changes in:
- Base image updates (security patches, package updates)
- System libraries (OpenSSL, glibc, etc.)
- Runtime dependencies installed via apt-get
- Python/Node runtime versions

#### How It Works

1. **Manifest Capture Stages**: Each production Dockerfile has a `manifest-capture` stage:
   ```dockerfile
   FROM runner AS manifest-capture
   RUN apt-get install -y jq
   COPY capture-system-manifest-simple.sh /scripts/
   RUN /scripts/capture-system-manifest.sh /manifest.json
   ENTRYPOINT []  # Reset to prevent app startup
   CMD ["cat", "/manifest.json"]
   ```

2. **Capture Script** (`docker/scripts/capture-system-manifest-simple.sh`):
   - Extracts OpenSSL, glibc, Node/Python versions
   - Lists Debian packages
   - Generates system fingerprint (SHA256 hash)
   - Outputs clean JSON using jq

3. **Workflows**:
   - **`.github/workflows/dependency-drift-detection.yaml`**: 
     - Runs hourly (cron)
     - Triggers on PRs/pushes affecting Docker or package files
     - Builds manifests for all services in parallel
     - Compares main vs prod manifests
     - Each service processes independently (build → compare)
   
   - **`.github/workflows/capture-prod-manifest.yaml`**:
     - Triggers on push to prod branch
     - Captures production manifests
     - Stores as GitHub artifacts (90 days retention)

#### Parallel Execution Architecture

```
evals-web:       [Build 20min] → [Compare 2min]
evals-queue:     [Build 8min]  → [Compare 2min]  
livekit-worker:  [Build 10min] → [Compare 2min]

All run simultaneously - comparisons start immediately after respective builds
```

#### Key Features

- **Automatic**: Any Dockerfile changes are captured without manual intervention
- **Accurate**: Captures exact production state after all modifications (e.g., OpenSSL 3.0.16 pinning)
- **Efficient**: Services process in parallel, comparisons start ASAP
- **Resilient**: Handles missing stages, failed artifacts, uses fallbacks

#### Example Output

```markdown
# evals-web Dependency Drift Report

**Date:** 2024-01-08 22:30:00 UTC
**Prod Manifest:** Captured on 2024-01-05 18:00:00

## Key System Libraries
| Library | Prod Version | Main Version |
|---------|--------------|--------------|
| OpenSSL | 3.0.16 | 3.0.17 |
| glibc | 2.36 | 2.36 |
| Node.js | v22.x.x | v22.x.x |

## Changes Detected
- OpenSSL version drift detected
```

#### When Drift is Detected

1. **Hourly checks** detect available updates in base images
2. **PR checks** show if changes will affect system dependencies
3. **Push to main** triggers comparison with production
4. **No risk assessment** - just reports changes for human review

#### Important Notes

- The manifest-capture stage MUST come after the runner/runtime stage to inherit the full state
- ENTRYPOINT must be reset in manifest-capture to prevent app startup
- Secrets (doppler_token, github_livekit_agents_pat) required for builds
- Prod branch may not have manifest-capture stages initially (uses fallback to runner/runtime stage)

## 📚 API Documentation

- [[/apps/evals-web/docs/api/README|REST API Reference]]
- [[/wiki/webhook-architecture|Webhook System]]
- [[/apps/evals-web/src/server/routers/CLAUDE|tRPC Router Documentation]]

## 🧪 Testing Documentation

- [[/wiki/test-driven-development|TDD Practices]]
- [[/apps/evals-web/src/tests/CLAUDE|Frontend Test Patterns]]
- [[/apps/evals-queue/src/__tests__/CLAUDE|Backend Test Examples]]

## 🚀 Recent Updates & Migrations

- [[/docs/doppler-migration|Doppler Environment Migration]]
- [[/docs/shared-types-migration|Shared Types Package Migration]]
- [[/docs/authentication-redirect-flag-fix|Auth System Updates]]

## 📖 Additional Resources

### Internal Documentation

- [[/wiki/README|Wiki Index]] - All wiki documentation
- [[/docs/README|Technical Docs]] - Implementation guides
- [[/product-specs/README|Product Specifications]]

### 📂 Technical Documentation Directory

The `/docs` folder contains detailed technical documentation. Key documents include:

#### Architecture & Design
- [[/docs/obsidian-claude-documentation-spec|Documentation Specification]] - Wiki-style links, Obsidian format, LLM-friendly navigation patterns, markdown best practices, cross-referencing strategy, documentation structure
- [[/docs/distributed-tracing/README|Distributed Tracing]] - OpenTelemetry setup, trace propagation, span attributes, SigNoz integration, context injection, performance monitoring, trace sampling strategies
- [[/docs/prisma-client-monorepo-architecture|Prisma Client Architecture]] - Shared Prisma client, schema management, migration workflows, type generation, connection pooling, query optimization, transaction handling
- [[/docs/db-connection-pool|Database Connection Pool]] - PostgreSQL connection limits, pool sizing, timeout configuration, connection lifecycle, monitoring queries, performance tuning

#### Development Patterns
- [[/docs/minimal-transaction-pattern|Minimal Transaction Pattern]] - Transaction boundaries, isolation levels, deadlock prevention, optimistic locking, retry strategies, Prisma transactions, performance optimization
- [[/docs/type-checking-usage|Type Checking Usage]] - npm run type-check commands, incremental type checking, CI=true mode, max-errors flag, file-specific checks, performance tips, 15-20 second validation
- [[/docs/unit-testing-best-practices|Unit Testing Best Practices]] - Vitest configuration, test structure, mocking strategies, fixture patterns, snapshot testing, coverage requirements, CI=true testing mode

##### ⚠️ CRITICAL: Avoiding Transaction Race Conditions

**Problem**: Creating records in a transaction then reading them back can cause race conditions due to replication lag.

**BAD Pattern - Race Condition Risk:**
```typescript
// ❌ DON'T DO THIS - Creates race condition
async function createTestCaseRuns(db: DbClient, testCases: TestCase[]) {
  // Create records in transaction, return only IDs
  const ids = await db.$transaction(async (tx) => {
    const createdIds: string[] = [];
    for (const testCase of testCases) {
      const id = cuid(); // Pre-generate ID
      //...
      createdIds.push(id);
    }
    return createdIds;
  });
  
  // ❌ RACE CONDITION: Transaction may not be committed/replicated yet
  const runs = await db.testCaseRun.findMany({
    where: { id: { in: ids } },
    include: { testCase: true, persona: true }
  });
  
  return runs; // May be missing data or return empty!
}
```

**GOOD Pattern - Return Directly from Transaction:**
```typescript
// ✅ DO THIS - No race condition, returns complete data
async function createTestCaseRuns(db: DbClient, testCases: TestCase[]) {
  // Create and return complete records within the transaction
  const completeRuns = await db.$transaction(async (tx) => {
    const runs = [];
    for (const testCase of testCases) {
      // Let Prisma auto-generate ID
      //...
      runs.push(run);
    }
    return runs; // Return complete records directly
  });
  
  return completeRuns; // Guaranteed to have all data
}
```

**Why This Matters:**
- **Replication Lag**: In distributed databases, writes may not be immediately visible to reads
- **Read-after-write Consistency**: Reading outside the transaction doesn't guarantee seeing the writes
- **Data Integrity**: Returning data from within the transaction ensures consistency
- **Performance**: Single transaction is more efficient than transaction + separate read query

**Key Principles:**
1. Always return complete records from transactions when you need them immediately
2. Use `include` in create/update operations to get related data
3. Avoid pre-generating IDs unless absolutely necessary (let DB handle it)
4. If you must read after writing, use the same transaction context

#### Feature Documentation