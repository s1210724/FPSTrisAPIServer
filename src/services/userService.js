const { hashPassword } = require('../auth/passwordHasher');

const userRepository = require('../repositories/userRepository');

function validateCreateUserPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    const error = new Error('Request body must be a JSON object.');
    error.status = 400;
    throw error;
  }

  const email = payload.email;
  const username = payload.username;
  const password = payload.password;

  if (!email || !username || !password) {
    const error = new Error('email, username, and password are required.');
    error.status = 400;
    throw error;
  }

  return { email, username, password };
}

async function getUsers(limit) {
  const safeLimit = Number.isInteger(limit) && limit > 0 && limit <= 100 ? limit : 25;
  return userRepository.getUsers(safeLimit);
}

async function createUser(payload) {
  const mappedPayload = validateCreateUserPayload(payload);
  const hashedPassword = await hashPassword(mappedPayload.password);

  return userRepository.createUser(
    mappedPayload.email,
    mappedPayload.username,
    hashedPassword
  );
}

async function getUserByUsername(username) {
  if (!username || typeof username !== 'string') {
    const error = new Error('Username must be a non-empty string.');
    error.status = 400;
    throw error;
  }
  return userRepository.getUserByUsername(username);
}

async function getUserClaims(userId) {
  if (!userId || typeof userId !== 'number') {
    const error = new Error('User ID must be a valid number.');
    error.status = 400;
    throw error;
  }
  return userRepository.getUserClaims(userId);
}

module.exports = {
  getUsers,
  createUser,
  getUserByUsername,
  getUserClaims
};
