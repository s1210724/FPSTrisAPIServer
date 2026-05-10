const { getPool } = require('../db/sqlClient');

async function getUsers(limit) {
  const pool = await getPool();

  const [rows] = await pool.execute(
    'SELECT id, username, email FROM `users` ORDER BY id DESC LIMIT ?;',
    [limit]
  );

  return rows;
}

async function createUser({ voornaam, achternaam }) {
  console.log('function is deprecated, create new func');
  // const pool = await getPool();

  // // Threat ID #90: Mitigatie voor SQL-injectie met prepared statements
  // const [insertResult] = await pool.execute(
  //   'INSERT INTO `users` (username, email) VALUES (?, ?);',
  //   [voornaam, achternaam]
  // );

  // const [rows] = await pool.execute(
  //   'SELECT id, username, email FROM `users` WHERE id = ?;',
  //   [insertResult.insertId]
  // );

  // return rows[0] || null;
}

async function getUserByUsername(username) {
    const pool = await getPool();

    const sql = `
        SELECT *
        FROM users
        WHERE username = ?
        LIMIT 1
    `;

    const rows = await pool.execute(sql, [username]);

    return rows[0];
}

async function getUserClaims(userId) {
    const pool = await getPool();

    const sql = `
        SELECT c.name
        FROM claims c
        INNER JOIN user_claims uc ON c.id = uc.claim_id
        WHERE uc.user_id = ?
    `;

    const [rows] = await pool.execute(sql, [userId]);

    return rows.map(row => row.name);
}

module.exports = {
  getUsers,
  createUser,
  getUserByUsername,
  getUserClaims
};
