const express = require('express');
const router = express.Router();
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/quote', sendQuoteEmail);
router.post('/contact', sendContactEmail);

export const sendQuoteEmail = async (req, res) => {
    try {
        const { name, email, address, message } = req.body;

        // 🔒 Validate
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // 📧 Send email
        await resend.emails.send({
            from: 'Website Quote <no-reply@gllsolutions.com>',
            to: process.env.COMPANY_EMAIL,
            reply_to: email,
            subject: 'New Quote Request',
            html: `
                <h2>New Quote Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Address:</strong> ${address || 'N/A'}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        });

        return res.status(200).json({
            success: true,
            message: 'Message sent successfully'
        });

    } catch (error) {
        console.error('Resend error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
};


export const sendContactEmail = async (req, res) => {
    try {
        const { first_name, last_name, email, website, message } = req.body;

        if (!first_name || !last_name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        await resend.emails.send({
            from: 'Website Contact <no-reply@gllsolutions.com>',
            to: process.env.COMPANY_EMAIL,
            reply_to: email,
            subject: 'New Contact Message',
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${first_name} ${last_name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Website:</strong> ${website || 'N/A'}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        });

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
};