// emailConn/emailProvider.js
// Abstraction layer for email providers (Brevo / Mailtrap fallback)

import dotenv from 'dotenv';
dotenv.config();

const EMAIL_PROVIDERS = {
    BREVO: 'brevo',
    MAILTRAP: 'mailtrap',
    CONSOLE: 'console', // For development/testing
};

const activeProvider = process.env.EMAIL_PROVIDER || EMAIL_PROVIDERS.BREVO;

/**
 * Sends an email using the configured provider.
 * @param {object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.toName - Recipient name
 * @param {string} options.subject - Email subject line
 * @param {string} options.htmlContent - HTML email body
 * @param {string} [options.textContent] - Plain text fallback
 * @returns {Promise<object>} - Provider response
 */
export const sendEmail = async ({ to, toName, subject, htmlContent, textContent }) => {
    if (!to || !subject || !htmlContent) {
        throw new Error('[EmailProvider] Missing required fields: to, subject, htmlContent.');
    }

    switch (activeProvider) {
        case EMAIL_PROVIDERS.BREVO:
            return await sendViaBrevo({ to, toName, subject, htmlContent, textContent });
        case EMAIL_PROVIDERS.MAILTRAP:
            return await sendViaMailtrap({ to, toName, subject, htmlContent, textContent });
        case EMAIL_PROVIDERS.CONSOLE:
        default:
            return logEmailToConsole({ to, toName, subject, htmlContent });
    }
};

/**
 * Sends an email via Brevo (Sendinblue) API.
 */
const sendViaBrevo = async ({ to, toName, subject, htmlContent, textContent }) => {
    const SibApiV3Sdk = await import('sib-api-v3-sdk');
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
        name: process.env.EMAIL_FROM_NAME || 'Synapse Synchrony',
        email: process.env.EMAIL_FROM || 'noreply@synapsesynchrony.com',
    };
    sendSmtpEmail.to = [{ email: to, name: toName || to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    if (textContent) sendSmtpEmail.textContent = textContent;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`[EmailProvider] Brevo email sent to ${to}. Message ID: ${response.messageId}`);
    return { provider: 'brevo', messageId: response.messageId };
};

/**
 * Sends an email via Mailtrap (for testing environments).
 */
const sendViaMailtrap = async ({ to, toName, subject, htmlContent }) => {
    const { MailtrapClient } = await import('mailtrap');
    const client = new MailtrapClient({ token: process.env.MAILTRAP_API_TOKEN });

    const response = await client.send({
        from: {
            name: process.env.EMAIL_FROM_NAME || 'Synapse Synchrony',
            email: process.env.EMAIL_FROM || 'hello@synapsesynchrony.com',
        },
        to: [{ email: to, name: toName || to }],
        subject,
        html: htmlContent,
    });

    console.log(`[EmailProvider] Mailtrap email sent to ${to}.`);
    return { provider: 'mailtrap', success: response.success };
};

/**
 * Logs email to console (development fallback — no actual email sent).
 */
const logEmailToConsole = ({ to, toName, subject, htmlContent }) => {
    console.log('\n====== [EmailProvider] CONSOLE MODE — EMAIL NOT SENT ======');
    console.log(`To: ${toName || ''} <${to}>`);
    console.log(`Subject: ${subject}`);
    console.log(`Content preview: ${htmlContent.substring(0, 200)}...`);
    console.log('===========================================================\n');
    return { provider: 'console', sent: false };
};

export { EMAIL_PROVIDERS, activeProvider };
export default sendEmail;
