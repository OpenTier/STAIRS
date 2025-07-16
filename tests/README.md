<!--
Copyright (c) 2025 by OpenTier GmbH
SPDX‑FileCopyrightText: 2025 OpenTier GmbH
SPDX‑License‑Identifier: MIT

This file is part of OpenTier.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->

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