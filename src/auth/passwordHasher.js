const bcrypt = require('bcrypt');

async function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    const error = new Error('Password must be a non-empty string.');
    error.status = 400;
    throw error;
  }

  return bcrypt.hash(password, 12);
}

module.exports = {
  hashPassword
};