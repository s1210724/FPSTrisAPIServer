const { getPool } = require('../db/sqlClient');

async function getUsers(limit) {
  const pool = await getPool();

  const [rows] = await pool.execute(
    'SELECT id, voornaam, achternaam FROM `user` ORDER BY id DESC LIMIT ?;',
    [limit]
  );

  return rows;
}

async function createUser({ voornaam, achternaam }) {
  const pool = await getPool();

  const [insertResult] = await pool.execute(
    'INSERT INTO `user` (voornaam, achternaam) VALUES (?, ?);',
    [voornaam, achternaam]
  );

  const [rows] = await pool.execute(
    'SELECT id, voornaam, achternaam FROM `user` WHERE id = ?;',
    [insertResult.insertId]
  );

  return rows[0] || null;
}

module.exports = {
  getUsers,
  createUser
};
