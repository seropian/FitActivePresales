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
    }
  ]
};
