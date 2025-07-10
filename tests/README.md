# API Testing Suite

This directory contains API tests for the platform using Playwright.

## Structure

```
tests/
├── package.json                 # Dependencies
├── playwright.config.js         # Playwright configuration
└── api/                         # API tests
    ├── stairs_api/              # STAIRS API tests
```

## Getting Started

### Prerequisites

- Make sure you have Node.js and npm installed (for local development)
- Docker and Docker Compose
- The platform services should be running

### Installation

```bash
cd tests
npm ci
npx playwright install
```

## Running Tests

### 🐳 Docker Usage (Recommended)

The Docker approach automatically handles all service dependencies and provides a consistent testing environment.

#### Start Services and Run API Tests

```bash
# Start required services and run API tests
docker compose -f docker-compose.yaml -f docker-compose.test.yaml up -d --build
docker compose -f docker-compose.yaml -f docker-compose.test.yaml run --rm unified_tests
```

```bash
docker compose -f docker-compose.yaml -f docker-compose.test.yaml run --rm unified_tests npx playwright test --project=api-tests
```

#### Run with Tag Filtering

```bash
# API tests using tags
docker compose -f docker-compose.yaml -f docker-compose.test.yaml run --rm unified_tests npx playwright test --grep "@api"
```

#### Run Specific Test File

```bash
docker compose -f docker-compose.yaml -f docker-compose.test.yaml run --rm unified_tests npx playwright test api/stairs_api/stairs-api.spec.ts
```

#### List All Available Tests

```bash
docker compose -f docker-compose.yaml -f docker-compose.test.yaml run --rm unified_tests npx playwright test --list
```

### 💻 Local Development (Alternative)

For local development without Docker (requires manual service management):

#### Run API Tests

```bash
npm test
# or
npx playwright test
```

#### Run API Tests Only

```bash
npm run test:api
# or
npx playwright test --project=api-tests
```

**Note**: Local development requires you to manually start the required services.

## Test Organization

### Tags

- `@api` - API tests that don't require browser interaction

### Projects

- `api-tests` - Fast API tests using HTTP requests

## Configuration

The main configuration is in `playwright.config.js`. Key features:

- **API-focused**: Optimized for fast API testing without browser overhead
- **CI optimization**: Appropriate timeouts and retry strategies for API tests
- **Parallel execution**: Tests run in parallel where possible

## CI/CD Integration

The `.github/workflows/testing-suite.yml` workflow provides:

1. **`api_tests`** - Runs API tests with required service dependencies

## Environment Variables

### API Tests

- `STAIRS_API_URL` - STAIRS API service URL (default: http://stairs_api:3001)

## Test Results

- **HTML Reports**: `playwright-report/`
- **Test Results**: `test-results/`
- **Artifacts**: Test results and reports for API tests

View reports:

```bash
npx playwright show-report
```