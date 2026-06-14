const nodemailer = require('nodemailer');

const host = process.env.MAILTRAP_HOST || 'smtp.mailtrap.io';
const port = Number(process.env.MAILTRAP_PORT || 2525);
const user = process.env.MAILTRAP_USER;
const pass = process.env.MAILTRAP_PASS;
const from = process.env.MAIL_FROM || 'no-reply@fpstris.local';

if (!user || !pass) {
  console.warn('Mailtrap SMTP credentials are not configured. Password reset emails will fail until MAILTRAP_USER and MAILTRAP_PASS are provided.');
}

const transporter = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass,
  },
});

async function sendPasswordResetEmail(to, username, code, expiresAt) {
  if (!user || !pass) {
    throw new Error('Mailtrap SMTP credentials missing (MAILTRAP_USER / MAILTRAP_PASS).');
  }

  const formattedExpiration = expiresAt ? new Date(expiresAt).toLocaleString() : 'soon';

  const html = `
    <p>Hi ${username || 'user'},</p>
    <p>We received a request to reset your password.</p>
    <p>Your password reset code is:</p>
    <h2>${code}</h2>
    <p>This code expires at <strong>${formattedExpiration}</strong>.</p>
    <p>If you did not request a password reset, you can safely ignore this email.</p>
  `;

  const message = {
    from,
    to,
    subject: 'FPSTris Password Reset Code',
    html,
  };

  return transporter.sendMail(message);
}

module.exports = {
  sendPasswordResetEmail,
};
