const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// GET: fetch current crypto payment details
router.get('/', async (req, res) => {
    try {
        const payment = await Payment.getInstance();
        res.json(payment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch payment details', error: err.message });
    }
});

// PUT: update crypto payment details
router.put('/', async (req, res) => {
    try {
        const { crypto } = req.body;

        if (!crypto || !crypto.address || !crypto.coinType || !crypto.qrUrl) {
            return res.status(400).json({ message: 'All crypto fields are required.' });
        }

        // Always update the singleton document
        const payment = await Payment.getInstance();

        payment.crypto.address = crypto.address;
        payment.crypto.coinType = crypto.coinType;
        payment.crypto.qrUrl = crypto.qrUrl;

        await payment.save();
        res.json(payment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to save crypto payment.', error: err.message });
    }
});

module.exports = router;
