const userRepository = require('../repositories/userRepository');

function validateCreateUserPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    const error = new Error('Request body must be a JSON object.');
    error.status = 400;
    throw error;
  }

  const voornaam = payload.voornaam || payload.firstName || payload.username;
  const achternaam = payload.achternaam || payload.lastName || payload.email;

  if (!voornaam || !achternaam) {
    const error = new Error('voornaam and achternaam are required (or firstName/lastName).');
    error.status = 400;
    throw error;
  }

  return { voornaam, achternaam };
}

async function getUsers(limit) {
  const safeLimit = Number.isInteger(limit) && limit > 0 && limit <= 100 ? limit : 25;
  return userRepository.getUsers(safeLimit);
}

async function createUser(payload) {
  const mappedPayload = validateCreateUserPayload(payload);

  return userRepository.createUser(mappedPayload);
}

async function getUserByUsername(username) {
  if (!username || typeof username !== 'string') {
    const error = new Error('Username must be a non-empty string.');
    error.status = 400;
    throw error;
  }
  return userRepository.getUserByUsername(username);
}

module.exports = {
  getUsers,
  createUser,
  getUserByUsername
};
