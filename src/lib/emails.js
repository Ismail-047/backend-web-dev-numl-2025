import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
} from "./email.templates.js";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
    },
});

export const sendEmailVerificationCode = async (sendTo, verificationCode) => {
    try {
        await transporter.sendMail({
            from: `"Book Swap" <${process.env.NODEMAILER_EMAIL}>`,
            to: sendTo,
            subject: "Email Verification - Book Swap",
            html: VERIFICATION_EMAIL_TEMPLATE.replace(`{verificationCode}`, verificationCode),
        });
    } catch (error) {
        console.error(error);
    }
};

export const sendEmailResetPassLink = async (sendTo, link) => {
    try {
        await transporter.sendMail({
            from: `"Book Swap" <${process.env.NODEMAILER_EMAIL}>`,
            to: sendTo,
            subject: "Password Reset Request - Book Swap",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(`{RESET_PASS_LINK}`, link),
        });
    } catch (error) {
        console.error(error);
    }
};
