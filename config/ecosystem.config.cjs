module.exports = {
  apps: [
    {
      name: 'fitactive-dev',
      script: './server/server.js',
      cwd: '/home/sero/apps/FitActivePresales',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001,
        DB_PATH: './data.sqlite'
      },
      error_file: '/var/log/pm2/fitactive-dev-error.log',
      out_file: '/var/log/pm2/fitactive-dev-out.log',
      log_file: '/var/log/pm2/fitactive-dev.log',
      time: true,
      watch: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000
    },
    {
      name: 'fitactive-test',
      script: './server/server.js',
      cwd: '/home/sero/apps/FitActivePresales',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'test',
        PORT: 3002
      },
      env_test: {
        NODE_ENV: 'test',
        PORT: 3002,
        DB_PATH: './data-test.sqlite'
      },
      error_file: '/var/log/pm2/fitactive-test-error.log',
      out_file: '/var/log/pm2/fitactive-test-out.log',
      log_file: '/var/log/pm2/fitactive-test.log',
      time: true,
      watch: true,
      max_restarts: 5,
      min_uptime: '5s',
      restart_delay: 2000
    },
    {
      name: 'fitactive-prod',
      script: './server/server.js',
      cwd: '/home/sero/apps/FitActivePresales',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3003,
        DB_PATH: './data-prod.sqlite'
      },
      error_file: '/var/log/pm2/fitactive-prod-error.log',
      out_file: '/var/log/pm2/fitactive-prod-out.log',
      log_file: '/var/log/pm2/fitactive-prod.log',
      time: true,
      watch: true,
      max_restarts: 15,
      min_uptime: '30s',
      restart_delay: 5000,
      max_memory_restart: '500M'
    }
  ]
};
