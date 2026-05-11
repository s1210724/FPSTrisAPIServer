const { getPool } = require('../db/sqlClient');

async function getUsers(limit) {
  const pool = await getPool();

  const [rows] = await pool.execute(
    'SELECT id, username, email FROM `users` ORDER BY id DESC LIMIT ?;',
    [limit]
  );

  return rows;
}

async function createUser(email, username, password) {
  const pool = await getPool();

  const sql = `
    INSERT INTO users (id, email, username, password, color_palette, played_games, wins, created_at, updated_at) 
    VALUES (NULL, ?, ?, ?, 'default', '0', '0', current_timestamp(), current_timestamp());
  `;
  const [result] = await pool.execute(sql, [email, username, password]);
  return result;
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
