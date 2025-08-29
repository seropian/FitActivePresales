# Getting Started - Development Guide

This guide will help you set up the FitActive Presales application for development.

## Prerequisites

- **Node.js**: Version 18.20.4 or higher (use `.nvmrc` file)
- **npm**: Version 8 or higher
- **Git**: For version control
- **Code Editor**: VS Code recommended with extensions

## Quick Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd FitActive-Presales-Starter2

# Install all dependencies (root, frontend, backend)
npm run install:all
```

### 2. Environment Configuration

```bash
# Copy environment template
cp server/.env.example server/.env

# Edit with your credentials
nano server/.env
```

Required credentials:
- NETOPIA API keys (sandbox for development)
- SmartBill credentials (sandbox for development)
- SMTP settings (Mailtrap recommended for development)

### 3. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:frontend  # Port 5173
npm run dev:server    # Port 3001
```

## Development Workflow

### Project Structure

```
├── frontend/           # React application
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── components/# Reusable components
│   │   │   └── ui/    # UI components
│   │   ├── hooks/     # Custom React hooks
│   │   ├── contexts/  # React contexts
│   │   ├── config/    # Configuration files
│   │   ├── lib/       # Utility functions
│   │   └── types/     # TypeScript types
├── server/            # Express backend
│   ├── src/
│   │   ├── controllers/# Route handlers
│   │   ├── middleware/ # Express middleware
│   │   ├── services/   # Business logic
│   │   ├── repositories/# Data access
│   │   ├── lib/        # Utilities
│   │   ├── config/     # Configuration
│   │   └── types/      # TypeScript types
├── config/            # Environment & deployment configs
├── docs/              # Documentation
└── tests/             # Integration tests
```

### Code Quality

The project includes:
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Vitest**: Testing framework

```bash
# Run linting
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

### Environment Switching

```bash
# Check current environment
npm run env:switch

# Switch to test environment
npm run env:switch test

# Switch to production environment
npm run env:switch production
```

## Development Tips

### Hot Reloading
- Frontend: Vite provides instant hot reloading
- Backend: Nodemon restarts server on file changes

### Database
- Development uses SQLite (`data.sqlite`)
- Database is automatically created on first run
- Use different databases for each environment

### Payment Testing
- Use NETOPIA sandbox environment
- Test cards available in NETOPIA documentation
- IPN testing requires ngrok for local development

### Debugging
- Use browser dev tools for frontend
- Backend logs are available in console
- Set `LOG_LEVEL=debug` for verbose logging

## Common Issues

### Port Conflicts
If ports are in use:
```bash
# Kill processes on specific ports
npx kill-port 3001 5173
```

### Database Issues
```bash
# Reset database
rm server/data.sqlite
# Restart server to recreate
```

### CORS Issues
- Check `CORS_ORIGIN` in environment file
- Ensure frontend URL matches CORS configuration

## Next Steps

- Read [API Documentation](../api/README.md)
- Check [Testing Guide](TESTING.md)
- Review [Code Style Guide](CODE_STYLE.md)
