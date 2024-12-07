import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import nodemailer from 'nodemailer';

const transporter = await nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
});

export const sendVerificationEmail = async (email, verificationToken) => {
    const options = ({
        from: 'Lucky Mr',
        to: email,
        subject: "Verification code",
        text: "Your verification code",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)
    });
    await transporter.sendMail(options);

}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const options = ({
        from: 'Lucky Mr',
        to: email,
        subject: "Reset code",
        text: "Your Reset code",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL)
    });
    await transporter.sendMail(options);
}