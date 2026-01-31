// emailConn/emailTemplates.js
// HTML email templates for all Synapse Synchrony transactional emails

const BRAND_COLOR = '#6366f1'; // Indigo
const BRAND_NAME = 'Synapse Synchrony';

const baseLayout = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND_NAME}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:${BRAND_COLOR};padding:24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;">${BRAND_NAME}</h1>
              <p style="margin:4px 0 0;color:#c7d2fe;font-size:13px;">Mental Wellness Platform</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                &copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.<br>
                This email was sent to you as a registered user.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

/**
 * Email verification template.
 * @param {string} name
 * @param {string} token
 * @returns {string} HTML
 */
export const verificationEmailTemplate = (name, token) =>
    baseLayout(`
    <h2 style="color:#1f2937;margin:0 0 8px;">Welcome to ${BRAND_NAME}, ${name}! 🎉</h2>
    <p style="color:#4b5563;line-height:1.6;">We're excited to have you on board. Please verify your email address to activate your account and start your mental wellness journey.</p>
    <div style="text-align:center;margin:32px 0;">
      <div style="display:inline-block;background:#f3f4f6;border-radius:8px;padding:16px 32px;">
        <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">Your verification code:</p>
        <p style="margin:0;font-size:36px;font-weight:bold;color:${BRAND_COLOR};letter-spacing:8px;">${token}</p>
      </div>
    </div>
    <p style="color:#4b5563;font-size:14px;">This code will expire in <strong>24 hours</strong>. If you didn't create an account, please ignore this email.</p>
  `);

/**
 * Welcome email template (sent after verification).
 * @param {string} name
 * @returns {string} HTML
 */
export const welcomeEmailTemplate = (name) =>
    baseLayout(`
    <h2 style="color:#1f2937;margin:0 0 8px;">Your account is verified, ${name}! ✅</h2>
    <p style="color:#4b5563;line-height:1.6;">Your email is now verified and your account is fully active. Here's what you can explore on Synapse Synchrony:</p>
    <ul style="color:#4b5563;line-height:2;">
      <li>🧠 <strong>AI Diagnosis</strong> — Get preliminary health assessments</li>
      <li>💊 <strong>MediLink</strong> — Medication information and guidance</li>
      <li>📊 <strong>Wellness Tracker</strong> — Log your mood and stress levels</li>
      <li>📅 <strong>Schedule Manager</strong> — Organize your healthcare appointments</li>
      <li>💬 <strong>Community</strong> — Connect with others on their wellness journey</li>
    </ul>
    <div style="text-align:center;margin-top:24px;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="background:${BRAND_COLOR};color:#fff;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Go to Dashboard</a>
    </div>
  `);

/**
 * Password reset email template.
 * @param {string} name
 * @param {string} resetLink
 * @returns {string} HTML
 */
export const passwordResetEmailTemplate = (name, resetLink) =>
    baseLayout(`
    <h2 style="color:#1f2937;margin:0 0 8px;">Password Reset Request</h2>
    <p style="color:#4b5563;line-height:1.6;">Hi ${name}, we received a request to reset your password. Click the button below to create a new password.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${resetLink}" style="background:${BRAND_COLOR};color:#fff;padding:14px 36px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Reset Password</a>
    </div>
    <p style="color:#6b7280;font-size:13px;">This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.</p>
    <p style="color:#9ca3af;font-size:12px;margin-top:16px;">Or copy and paste this link: <br><span style="color:${BRAND_COLOR};">${resetLink}</span></p>
  `);

export default { verificationEmailTemplate, welcomeEmailTemplate, passwordResetEmailTemplate };
