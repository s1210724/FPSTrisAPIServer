const mysql = require('mysql2/promise');
const credentials = require('../config/db.credentials');

let pool;

async function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: credentials.host || credentials.server || 'localhost',
      port: credentials.port || 3306,
      user: credentials.user,
      password: credentials.password,
      database: credentials.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  return pool;
}

module.exports = {
  getPool
};
