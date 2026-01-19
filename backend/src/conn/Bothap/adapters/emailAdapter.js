// adapters/emailAdapter.js
// Nodemailer transport adapter for Synapse Synchrony notification emails

import nodemailer from 'nodemailer';

let _transporter = null;

/**
 * Build and cache the Nodemailer transporter.
 */
const getTransporter = () => {
    if (_transporter) return _transporter;

    _transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST ?? 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT ?? 587),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    return _transporter;
};

/**
 * Send a plain-text or HTML email.
 * @param {object} opts
 * @param {string} opts.to
 * @param {string} opts.subject
 * @param {string} [opts.text]
 * @param {string} [opts.html]
 */
export const sendEmail = async ({ to, subject, text, html }) => {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
        from: `"Synapse Synchrony" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    });

    return info;
};

/**
 * Send a welcome / account-verification email.
 * @param {string} to
 * @param {string} name
 * @param {string} verifyUrl
 */
export const sendVerificationEmail = async (to, name, verifyUrl) => {
    return sendEmail({
        to,
        subject: 'Verify your Synapse Synchrony account',
        html: `
      <h2>Welcome, ${name}!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verifyUrl}" style="color:#6d28d9">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
    });
};

/**
 * Send a password-reset email.
 * @param {string} to
 * @param {string} resetUrl
 */
export const sendPasswordResetEmail = async (to, resetUrl) => {
    return sendEmail({
        to,
        subject: 'Reset your Synapse Synchrony password',
        html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password. It expires in 1 hour.</p>
      <a href="${resetUrl}" style="color:#6d28d9">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
    });
};

/**
 * Send a generic notification email.
 * @param {string} to
 * @param {string} subject
 * @param {string} bodyText
 */
export const sendNotification = async (to, subject, bodyText) => {
    return sendEmail({ to, subject, text: bodyText });
};

export default { sendEmail, sendVerificationEmail, sendPasswordResetEmail, sendNotification };
