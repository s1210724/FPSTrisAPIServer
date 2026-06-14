const { hashPassword } = require('../auth/passwordHasher');
const emailService = require('./emailService');
const userRepository = require('../repositories/userRepository');

const codeExpiresMinutes = Number(process.env.PASSWORD_RESET_CODE_EXPIRES_MINUTES || 15);

function createSixDigitCode() {
  return String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
}

function getExpirationDate() {
  return new Date(Date.now() + codeExpiresMinutes * 60 * 1000);
}

async function requestPasswordReset(email) {
  if (!email || typeof email !== 'string') {
    const error = new Error('A valid email address is required.');
    error.status = 400;
    throw error;
  }

  const user = await userRepository.getUserByEmail(email);

  if (!user) {
    return { message: 'If that email is registered, a password reset code has been sent.' };
  }

  const code = createSixDigitCode();
  const expiresAt = getExpirationDate();

  await userRepository.createPasswordResetCode(user.id, code, expiresAt);
  await emailService.sendPasswordResetEmail(user.email, user.username, code, expiresAt);

  return { message: 'If that email is registered, a password reset code has been sent.' };
}

async function resetPassword(email, code, newPassword) {
  if (!email || typeof email !== 'string') {
    const error = new Error('A valid email address is required.');
    error.status = 400;
    throw error;
  }

  if (!code || typeof code !== 'string') {
    const error = new Error('A 6-digit reset code is required.');
    error.status = 400;
    throw error;
  }

  if (!newPassword || typeof newPassword !== 'string') {
    const error = new Error('A new password is required.');
    error.status = 400;
    throw error;
  }

  const user = await userRepository.getUserByEmail(email);

  if (!user) {
    const error = new Error('Invalid password reset request.');
    error.status = 400;
    throw error;
  }

  const codeRecord = await userRepository.getPasswordResetCode(user.id, code);

  if (!codeRecord || codeRecord.used || new Date(codeRecord.expires_at) < new Date()) {
    const error = new Error('Invalid or expired password reset code.');
    error.status = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(newPassword);
  await userRepository.updateUserPassword(user.id, hashedPassword);
  await userRepository.markPasswordResetCodeUsed(codeRecord.id);

  return { message: 'Password reset successful' };
}

module.exports = {
  requestPasswordReset,
  resetPassword,
};
