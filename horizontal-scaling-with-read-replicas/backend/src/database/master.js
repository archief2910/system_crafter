const mysql = require('mysql2/promise');
const config = require('../config');

// Create a connection pool for the Master database
// The master handles all INSERT, UPDATE, DELETE queries
const masterPool = mysql.createPool({
  host: config.master.host,
  port: config.master.port,
  user: config.master.user,
  password: config.master.password,
  database: config.master.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = masterPool;
