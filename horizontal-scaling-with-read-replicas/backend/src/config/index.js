require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  master: {
    host: process.env.MASTER_DB_HOST || '127.0.0.1',
    port: process.env.MASTER_DB_PORT || 3306,
    user: process.env.MASTER_DB_USER || 'app_user',
    password: process.env.MASTER_DB_PASSWORD || 'app_password',
    database: process.env.MASTER_DB_NAME || 'social_network',
  },
  replica: {
    host: process.env.REPLICA_DB_HOST || '127.0.0.1',
    port: process.env.REPLICA_DB_PORT || 3307,
    user: process.env.REPLICA_DB_USER || 'app_user',
    password: process.env.REPLICA_DB_PASSWORD || 'app_password',
    database: process.env.REPLICA_DB_NAME || 'social_network',
  }
};
