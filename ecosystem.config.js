module.exports = {
  apps : [{
    name: 'server',
    script: 'app.js',
    autorestart: true,
    env: {
        COMMON_VARIABLE: "true"
      },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : '47.101.137.155',
      ref  : 'origin/master',
      repo : 'git@github.com:HyOner/microChat.git',
      path : '/root/www/microChat/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
