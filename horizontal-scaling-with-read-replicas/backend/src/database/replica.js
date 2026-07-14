const mysql = require('mysql2/promise');
const config = require('../config');

// Create a connection pool for the Replica database
// The replica handles ONLY SELECT queries
const replicaPool = mysql.createPool({
  host: config.replica.host,
  port: config.replica.port,
  user: config.replica.user,
  password: config.replica.password,
  database: config.replica.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = replicaPool;
