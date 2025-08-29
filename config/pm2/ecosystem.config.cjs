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
      env_dev: {
        NODE_ENV: 'development',
        PORT: 3001,
        DB_PATH: './data.sqlite'
      },
      env_test: {
        NODE_ENV: 'test',
        PORT: 3002,
        DB_PATH: './data-test.sqlite'
      },
      env_prod: {
        NODE_ENV: 'production',
        PORT: 3003,
        DB_PATH: './data-prod.sqlite'
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
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000
    },
    {
      name: 'fitactive-prod',
      script: './server/server.js',
      cwd: '/home/sero/apps/FitActivePresales',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      },
      env_prod: {
        NODE_ENV: 'production',
        PORT: 3003,
        DB_PATH: './data-prod.sqlite'
      },
      error_file: '/var/log/pm2/fitactive-prod-error.log',
      out_file: '/var/log/pm2/fitactive-prod-out.log',
      log_file: '/var/log/pm2/fitactive-prod.log',
      time: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000
    }
  ]
};
