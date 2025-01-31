module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'API',
      script: 'src',
      watch: false,
      exec_mode: 'cluster_mode',
      instances: 'max',
      ignoreWatch: ['.idea/*', '.git/*', 'src/api/routes/v1/images'],
	  log_date_format: 'DD-MM-YY HH:mm',
	  out_file: "/dev/null",
	  error_file: "/dev/null",
      env: {
        NODE_ENV: 'development',
        node_args: ['--debug=7000'],
      },
    },
    {
      name: 'API_LOCAL',
      script: 'src',
      watch: true,
      exec_mode: 'fork',
	  ignore_watch: ['.idea/*', '.git/*', 'src/api/routes/v1/images'],
	  log_date_format: 'DD-MM-YY HH:mm',
	  out_file: "/dev/null",
	  error_file: "/dev/null",
      env: {
        NODE_ENV: 'development',
        node_args: ['--debug=7000'],
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    dev: {
      user: 'ubuntu',
      host: 'host',
      key: 'path to pem',
      ref: 'git@github.com:DenisRupp/API-express-starter.git',
      path: '/var/www/API-express-starter',
      ssh_options: 'ForwardAgent=yes',
      'post-deploy':
        'cp ../shared/.env .env && yarn && yarn docs-examples && yarn start',
      'pre-setup':
        'npm install -g yarn && npm install -g pm2 && npm install -g apidoc ',
      'post-setup':
        'yarn && cp src/database/config.example.js src/database/config.js',
    },
  },
};
