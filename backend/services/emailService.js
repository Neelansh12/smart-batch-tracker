const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Create a test account for Ethereal if no env vars provided
        this.transporter = null;
        this.init();
    }

    async init() {
        try {
            if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
                this.transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST,
                    port: process.env.EMAIL_PORT || 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });
            } else {
                // Use Ethereal for testing
                const testAccount = await nodemailer.createTestAccount();
                this.transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                });
                console.log('Ethereal Email initialized');
                console.log('User:', testAccount.user);
                console.log('Pass:', testAccount.pass);
            }
        } catch (err) {
            console.error('Failed to initialize email service:', err);
        }
    }

    async sendVerificationEmail(to, token) {
        if (!this.transporter) await this.init();

        const info = await this.transporter.sendMail({
            from: '"Smart Batch Tracker" <noreply@smartbatch.com>',
            to: to,
            subject: 'Email Verification - Smart Batch Tracker',
            text: `Your verification code is: ${token}. It expires in 15 minutes.`,
            html: `<b>Your verification code is: ${token}</b><br>It expires in 15 minutes.`,
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return info;
    }
}

module.exports = new EmailService();
