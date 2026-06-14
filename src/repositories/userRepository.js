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

    const [rows] = await pool.execute(sql, [username]);

    return rows[0];
}

async function getUserByEmail(email) {
    const pool = await getPool();

    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
        LIMIT 1
    `;

    const [rows] = await pool.execute(sql, [email]);

    return rows[0];
}

async function getUserById(userId) {
    const pool = await getPool();

    const sql = `
        SELECT *
        FROM users
        WHERE id = ?
        LIMIT 1
    `;

    const [rows] = await pool.execute(sql, [userId]);

    return rows[0];
}

async function updateUserPassword(userId, password) {
    const pool = await getPool();

    const sql = `
        UPDATE users
        SET password = ?, updated_at = current_timestamp()
        WHERE id = ?
    `;

    const [result] = await pool.execute(sql, [password, userId]);

    return result;
}

async function createPasswordResetCode(userId, code, expiresAt) {
    const pool = await getPool();

    const sql = `
        INSERT INTO password_reset_codes (user_id, code, expires_at, used, created_at)
        VALUES (?, ?, ?, 0, current_timestamp())
    `;

    const [result] = await pool.execute(sql, [userId, code, expiresAt]);

    return result;
}

async function getPasswordResetCode(userId, code) {
    const pool = await getPool();

    const sql = `
        SELECT *
        FROM password_reset_codes
        WHERE user_id = ?
          AND code = ?
        ORDER BY created_at DESC
        LIMIT 1
    `;

    const [rows] = await pool.execute(sql, [userId, code]);

    return rows[0];
}

async function markPasswordResetCodeUsed(codeId) {
    const pool = await getPool();

    const sql = `
        UPDATE password_reset_codes
        SET used = 1
        WHERE id = ?
    `;

    const [result] = await pool.execute(sql, [codeId]);

    return result;
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
  getUserByEmail,
  getUserById,
  updateUserPassword,
  createPasswordResetCode,
  getPasswordResetCode,
  markPasswordResetCodeUsed,
  getUserClaims
};
