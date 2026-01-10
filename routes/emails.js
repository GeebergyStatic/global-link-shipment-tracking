const express = require('express');
const { Resend } = require('resend');

const router = express.Router();

// 🔐 Validate env
if (!process.env.RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY');
}
if (!process.env.COMPANY_EMAIL) {
    throw new Error('Missing COMPANY_EMAIL');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// 🧼 Simple HTML escape
const escapeHtml = (text = '') =>
    text.replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[m]));

/* =======================
   QUOTE EMAIL
======================= */
const sendQuoteEmail = async (req, res) => {
    try {
        const { name, email, address, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        await resend.emails.send({
            from: 'Website Quote <no-reply@gllsolutions.com>',
            to: process.env.COMPANY_EMAIL,
            reply_to: email,
            subject: 'New Quote Request',
            html: `
                <h2>New Quote Request</h2>
                <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Address:</strong> ${escapeHtml(address || 'N/A')}</p>
                <p><strong>Message:</strong></p>
                <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
            `
        });

        res.status(200).json({
            success: true,
            message: 'Message sent successfully'
        });

    } catch (error) {
        console.error('Resend error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
};

/* =======================
   CONTACT EMAIL
======================= */
const sendContactEmail = async (req, res) => {
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
                <p><strong>Name:</strong> ${escapeHtml(first_name)} ${escapeHtml(last_name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Website:</strong> ${escapeHtml(website || 'N/A')}</p>
                <p><strong>Message:</strong></p>
                <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
            `
        });

        res.json({ success: true });

    } catch (error) {
        console.error('Resend error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
};

/* =======================
   ROUTES
======================= */
router.post('/quote', sendQuoteEmail);
router.post('/contact', sendContactEmail);

module.exports = router;
