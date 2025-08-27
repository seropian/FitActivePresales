# FitActive Presales - Deployment Guide

This guide explains how to deploy and manage the FitActive Presales application across different environments.

## Environment Overview

The application supports three environments:

| Environment | Port | Database | Purpose |
|-------------|------|----------|---------|
| **Development** | 3001 | `data.sqlite` | Local development with sandbox APIs |
| **Test** | 3002 | `data-test.sqlite` | Testing with mock services |
| **Production** | 3003 | `data-prod.sqlite` | Live production environment |

## Quick Start

### Using the Deployment Script

```bash
# Start development environment
./scripts/deploy.sh dev start

# Start test environment
./scripts/deploy.sh test start

# Start production environment
./scripts/deploy.sh prod start

# Build frontend and start development
./scripts/deploy.sh dev build

# Restart production
./scripts/deploy.sh prod restart

# Check status
./scripts/deploy.sh dev status

# View logs
./scripts/deploy.sh dev logs
```

### Manual PM2 Commands

```bash
# Start specific environment
pm2 start config/ecosystem.config.js --only fitactive-dev --env development
pm2 start config/ecosystem.config.js --only fitactive-test --env test
pm2 start config/ecosystem.config.js --only fitactive-prod --env production

# Restart with environment variables
pm2 restart fitactive-dev --env development
pm2 restart fitactive-test --env test
pm2 restart fitactive-prod --env production

# Stop applications
pm2 stop fitactive-dev
pm2 stop fitactive-test
pm2 stop fitactive-prod

# View status
pm2 status

# View logs
pm2 logs fitactive-dev
pm2 logs fitactive-test
pm2 logs fitactive-prod
```

## Environment Configuration

### Development (.env)
- Uses sandbox NETOPIA API
- Real email services (Mailtrap recommended)
- Debug logging enabled
- Port: 3001

### Test (.env.test)
- Uses sandbox NETOPIA API
- Mock services enabled
- Payments disabled
- Debug logging enabled
- Port: 3002

### Production (.env.prod)
- Uses production NETOPIA API
- Real payment processing
- Production SMTP
- Debug logging disabled
- Port: 3003
- Cluster mode (2 instances)

## Environment Variables

### Required for Production
Before deploying to production, update these variables in `.env.prod`:

```bash
# NETOPIA Production Credentials
NETOPIA_API_KEY=YOUR_PRODUCTION_NETOPIA_API_KEY
NETOPIA_POS_SIGNATURE=YOUR_PRODUCTION_POS_SIGNATURE

# SmartBill Production Credentials
SMARTBILL_EMAIL=your_actual_email@company.com
SMARTBILL_TOKEN=your_actual_smartbill_token

# Production SMTP
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Deployment Workflow

### Development Deployment
1. Make code changes
2. Test locally
3. Build frontend: `npm run build` (in frontend directory)
4. Restart development: `./scripts/deploy.sh dev restart`

### Production Deployment
1. Test in development environment
2. Run tests: `./scripts/deploy.sh test start`
3. Build frontend: `npm run build`
4. Deploy to production: `./scripts/deploy.sh prod build`
5. Monitor logs: `./scripts/deploy.sh prod logs`

## Monitoring

### PM2 Monitoring
```bash
# Real-time monitoring
pm2 monit

# Process list
pm2 list

# Detailed info
pm2 show fitactive-prod

# Restart on file changes (development only)
pm2 start config/ecosystem.config.js --only fitactive-dev --watch
```

### Log Files
Logs are stored in `/var/log/pm2/`:
- `fitactive-dev-error.log` - Development errors
- `fitactive-dev-out.log` - Development output
- `fitactive-test-error.log` - Test errors
- `fitactive-test-out.log` - Test output
- `fitactive-prod-error.log` - Production errors
- `fitactive-prod-out.log` - Production output

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :3001
   
   # Kill process if needed
   kill -9 <PID>
   ```

2. **Environment variables not loading**
   ```bash
   # Restart with --update-env flag
   pm2 restart fitactive-dev --update-env
   ```

3. **Database issues**
   ```bash
   # Check database file permissions
   ls -la data*.sqlite
   
   # Reset test database
   rm data-test.sqlite
   ```

4. **Frontend not updating**
   ```bash
   # Rebuild frontend
   cd frontend && npm run build
   
   # Clear browser cache
   # Hard refresh (Ctrl+F5 or Cmd+Shift+R)
   ```

### Health Checks

```bash
# Check if services are running
curl http://localhost:3001/health  # Development
curl http://localhost:3002/health  # Test
curl http://localhost:3003/health  # Production

# Check external access (production)
curl https://presale.fitactive.open-sky.org/health
```

## Security Notes

- Never commit `.env.prod` with real credentials to version control
- Use environment variables or secure vaults for production secrets
- Regularly rotate API keys and passwords
- Monitor logs for suspicious activity
- Keep dependencies updated

## Backup Strategy

### Database Backups
```bash
# Backup production database
cp data-prod.sqlite backups/data-prod-$(date +%Y%m%d_%H%M%S).sqlite

# Automated backup (add to crontab)
0 2 * * * cd /path/to/app && cp data-prod.sqlite backups/data-prod-$(date +\%Y\%m\%d_\%H\%M\%S).sqlite
```

### Configuration Backups
```bash
# Backup environment files
tar -czf config-backup-$(date +%Y%m%d).tar.gz server/.env* config/
```
