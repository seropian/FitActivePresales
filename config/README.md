# Configuration Directory

This directory contains all configuration files for the FitActive Presales application.

## Structure

```
config/
├── environments/          # Environment configuration templates
│   └── .env.example      # Template for environment variables
├── nginx/                # Nginx server configurations
│   ├── nginx-production.conf
│   └── nginx-https-only.conf
└── pm2/                  # PM2 process manager configurations
    └── ecosystem.config.cjs
```

**Note:** Environment-specific configuration files are now located in the `server/` directory:
- `server/.env.example` - Template with all configuration options
- `server/.env` - Development environment (copy from .env.example)
- `server/.env.test` - Test environment
- `server/.env.prod` - Production environment

## Environment Configuration

### Setup
1. Copy the environment template to your server directory:
   ```bash
   cp server/.env.example server/.env
   ```

2. Edit the copied file with your actual credentials and settings.

### Environment Variables

- **NODE_ENV**: Application environment (development, test, production)
- **PORT**: Server port number
- **DATABASE_PATH**: SQLite database file path
- **NETOPIA_***: Payment gateway configuration
- **SMARTBILL_***: Invoice service configuration
- **SMTP_***: Email service configuration
- **CORS_ORIGIN**: Allowed frontend origins

### Security Notes

- Never commit actual `.env` files with real credentials
- Use strong, unique secrets for JWT_SECRET and SESSION_SECRET
- Enable HTTPS in production
- Use environment-specific database files

## Nginx Configuration

The nginx configurations are optimized for:
- SSL/TLS termination
- Static file serving
- API proxy to Node.js backend
- Security headers
- Gzip compression

## PM2 Configuration

The PM2 ecosystem file manages:
- Multiple environment deployments
- Process monitoring
- Automatic restarts
- Log management
