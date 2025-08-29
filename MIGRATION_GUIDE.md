# Migration Guide - Project Reorganization

This guide explains the changes made during the project reorganization and how to adapt to the new structure.

## Overview of Changes

The FitActive Presales project has been reorganized according to modern best practices for full-stack development. This includes better folder structure, improved configuration management, enhanced development tooling, and comprehensive documentation.

## Major Structural Changes

### 1. Root Level Organization
**Before:**
```
├── package.json
├── README.md
├── .gitignore (basic)
```

**After:**
```
├── package.json (enhanced with better scripts)
├── README.md
├── .gitignore (comprehensive)
├── .nvmrc (Node.js version specification)
├── .editorconfig (consistent code formatting)
├── LICENSE (proper license file)
├── MIGRATION_GUIDE.md (this file)
```

### 2. Frontend Structure Reorganization
**Before:**
```
frontend/src/
├── components/ (all components mixed)
├── utils/
├── types/
└── constants/
```

**After:**
```
frontend/src/
├── pages/ (page components)
├── components/
│   ├── ui/ (reusable UI components)
│   └── layout/ (layout components)
├── hooks/ (custom React hooks)
├── contexts/ (React contexts)
├── config/ (configuration files)
├── lib/ (utility functions)
├── assets/ (static assets)
├── types/ (TypeScript types)
└── constants/
```

### 3. Backend Structure Reorganization
**Before:**
```
server/
├── routes/
├── services/
├── utils/
├── types/
├── config/
└── database/
```

**After:**
```
server/src/
├── controllers/ (route handlers - moved from routes/)
├── middleware/ (Express middleware)
├── services/ (business logic)
├── repositories/ (data access - moved from database/)
├── models/ (data models)
├── lib/ (utilities - moved from utils/)
├── config/ (configuration)
├── types/ (TypeScript types)
└── tests/ (unit tests)
```

### 4. Configuration Management
**Before:**
- Scattered configuration files
- Basic environment setup

**After:**
```
config/
├── environments/ (environment templates)
│   └── .env.example
├── nginx/ (server configurations)
├── pm2/ (process manager configs)
└── README.md

server/
├── .env.example (environment template)
├── .env (development environment)
├── .env.test (test environment)
└── .env.prod (production environment)
```

### 5. Documentation Structure
**Before:**
```
docs/ (flat structure with mixed content)
```

**After:**
```
docs/
├── development/ (development guides)
├── deployment/ (deployment docs)
├── api/ (API documentation)
├── guides/ (user guides)
├── assets/ (documentation assets)
└── README.md
```

### 6. Testing Organization
**Before:**
```
tests/ (flat structure)
```

**After:**
```
tests/
├── integration/ (integration tests)
├── e2e/ (end-to-end tests)
├── utils/ (test utilities)
├── fixtures/ (test data)
└── README.md
```

## Breaking Changes

### Import Path Changes
Due to the reorganization, some import paths have changed:

**Frontend:**
```typescript
// Before
import { LandingPage } from './components/LandingPage';

// After
import { LandingPage } from './pages/LandingPage';
// or
import { LandingPage } from './pages';
```

**Backend:**
```typescript
// Before
import { logger } from '../utils/logger';

// After
import { logger } from '../lib/logger';
// or
import { logger } from '../lib';
```

### Configuration Changes
Environment files have been moved and standardized:

**Before:**
```bash
cp .env.example .env
```

**After:**
```bash
cp server/.env.example server/.env
```

## Migration Steps

### 1. Update Dependencies
```bash
# Install new development dependencies
npm install --save-dev husky @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier

# Update existing dependencies
npm update
```

### 2. Update Import Statements
Review and update import statements in your code to match the new structure. Use your IDE's "Find and Replace" feature to update paths systematically.

### 3. Update Environment Configuration
```bash
# Copy environment template
cp server/.env.example server/.env

# Edit with your credentials
nano server/.env
```

### 4. Update Build Scripts
The build process has been improved. Update your deployment scripts to use:
```bash
npm run build  # Builds both frontend and backend
npm run clean  # Cleans both frontend and backend
```

### 5. Update Git Hooks
Initialize Husky for pre-commit hooks:
```bash
npx husky install
```

## New Features

### 1. Enhanced Development Experience
- Pre-commit hooks for code quality
- Better VS Code integration
- Improved linting and formatting
- Comprehensive TypeScript configuration

### 2. Better Configuration Management
- Environment-specific configurations
- Centralized configuration files
- Better security defaults

### 3. Improved Documentation
- Structured documentation
- Development guides
- API documentation
- Testing guides

### 4. Enhanced Security
- Security middleware
- Input validation
- Rate limiting
- Security headers

## Verification Steps

After migration, verify everything works:

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Run development servers:**
   ```bash
   npm run dev
   ```

3. **Run tests:**
   ```bash
   npm run test:frontend
   npm run test:backend
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Rollback Plan

If you need to rollback:
1. Use Git to revert to the previous commit
2. Restore the old structure
3. Update import paths back to original

## Support

For questions or issues with the migration:
1. Check the updated documentation in `docs/`
2. Review the `README.md` for quick reference
3. Check the configuration examples in `config/`

## Next Steps

After successful migration:
1. Review the new development workflow
2. Update your team's documentation
3. Consider additional optimizations
4. Set up monitoring and logging
